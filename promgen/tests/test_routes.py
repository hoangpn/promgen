# Copyright (c) 2017 LINE Corporation
# These sources are released under the terms of the MIT license: see LICENSE
from unittest import mock

import requests
from django.test import override_settings
from django.urls import reverse

from promgen import models, tests, views

TEST_SETTINGS = tests.Data("examples", "promgen.yml").yaml()
TEST_IMPORT = tests.Data("examples", "import.json").raw()
TEST_REPLACE = tests.Data("examples", "replace.json").raw()


class RouteTests(tests.PromgenTest):
    def setUp(self):
        self.user = self.force_login(username="demo")

    @override_settings(PROMGEN=TEST_SETTINGS)
    @override_settings(CELERY_TASK_ALWAYS_EAGER=True)
    @mock.patch("promgen.signals._trigger_write_config")
    @mock.patch("promgen.tasks.reload_prometheus")
    def test_import(self, mock_write, mock_reload):
        self.add_user_permissions(
            "promgen.change_rule", "promgen.change_site", "promgen.change_exporter"
        )
        response = self.client.post(reverse("import"), {"config": TEST_IMPORT})

        self.assertRoute(response, views.Import, 302, "Redirect to imported object")
        self.assertCount(models.Service, 3, "Import one service (Fixture has two services)")
        self.assertCount(models.Project, 4, "Import two projects")
        self.assertCount(models.Exporter, 4, "Import two more exporters")
        self.assertCount(models.Host, 3, "Import three hosts")

    @override_settings(PROMGEN=TEST_SETTINGS)
    @override_settings(CELERY_TASK_ALWAYS_EAGER=True)
    @mock.patch("promgen.signals._trigger_write_config")
    @mock.patch("promgen.tasks.reload_prometheus")
    def test_replace(self, mock_write, mock_reload):
        self.add_user_permissions(
            "promgen.change_rule", "promgen.change_site", "promgen.change_exporter"
        )

        response = self.client.post(reverse("import"), {"config": TEST_IMPORT})
        self.assertRoute(response, views.Import, 302, "Redirect to imported object")

        response = self.client.post(reverse("import"), {"config": TEST_REPLACE})
        self.assertRoute(response, views.Import, 302, "Redirect to imported object (2)")

        self.assertCount(models.Service, 3, "Import one service (Fixture has two services)")
        self.assertCount(models.Project, 4, "Import two projects (Fixture has 2 projectsa)")
        self.assertCount(models.Exporter, 4, "Import two more exporters")
        self.assertCount(
            models.Farm, 3, "Original one farm and one updated farm (fixture has one farm)"
        )
        self.assertCount(models.Host, 5, "Original 3 hosts and two new ones")

    @mock.patch("requests.get")
    def test_scrape(self, mock_get):
        shard = models.Shard.objects.create(name="test_scrape_shard")
        service = models.Service.objects.create(name="test_scrape_service", owner=self.user)
        project = models.Project.objects.create(
            name="test_scrape_project", service=service, shard=shard, owner=self.user
        )
        farm = models.Farm.objects.create(name="test_scrape_farm", project=project)
        farm.host_set.create(name="example.com")

        # Uses the scrape target as the key, and the POST body that should
        # result in that URL
        exporters = {
            "http://example.com:8000/metrics": {
                "target": "#exporterresult",
                "job": "foo",
                "port": 8000,
                "scheme": "http",
            },
            "https://example.com:8000/foo": {
                "target": "#exporterresult",
                "job": "foo",
                "port": 8000,
                "path": "/foo",
                "scheme": "https",
            },
        }

        for url, body in exporters.items():
            response = requests.Response()
            response.url = url
            response.status_code = 200
            mock_get.return_value = response

            # For each POST body, check to see that we generate and attempt to
            # scrape the correct URL
            response = self.client.post(reverse("exporter-scrape", kwargs={"pk": project.pk}), body)
            self.assertRoute(response, views.ExporterScrape, 200)
            self.assertEqual(mock_get.call_args[0][0], url)

    @mock.patch("promgen.util.scrape")
    def test_scrape_timeout(self, mock_scrape):
        """Test that scrape operation handles timeouts gracefully"""
        
        shard = models.Shard.objects.create(name="test_timeout_shard")
        service = models.Service.objects.create(name="test_timeout_service", owner=self.user)
        project = models.Project.objects.create(
            name="test_timeout_project", service=service, shard=shard, owner=self.user
        )
        farm = models.Farm.objects.create(name="test_timeout_farm", project=project)
        # Create multiple hosts to simulate a scenario with many hosts
        for i in range(5):
            farm.host_set.create(name=f"host{i}.example.com")

        # Simulate a timeout by making util.scrape raise a Timeout exception
        mock_scrape.side_effect = requests.Timeout("Connection timed out")

        body = {
            "target": "#exporterresult",
            "job": "foo",
            "port": 8000,
            "scheme": "http",
        }

        response = self.client.post(reverse("exporter-scrape", kwargs={"pk": project.pk}), body)
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains timeout errors
        data = response.json()
        # Each host should have a timeout error
        timeout_errors = [v for v in data.values() if "timeout" in str(v).lower()]
        self.assertTrue(len(timeout_errors) > 0, "Should have timeout errors in response")

    @mock.patch("promgen.util.scrape")
    @mock.patch("promgen.views.ExporterScrape.SCRAPE_TIMEOUT", 2)  # Use a short timeout for testing
    def test_scrape_overall_timeout(self, mock_scrape):
        """Test that overall scrape operation times out when individual requests take too long"""
        import time
        
        shard = models.Shard.objects.create(name="test_overall_timeout_shard")
        service = models.Service.objects.create(name="test_overall_timeout_service", owner=self.user)
        project = models.Project.objects.create(
            name="test_overall_timeout_project", service=service, shard=shard, owner=self.user
        )
        farm = models.Farm.objects.create(name="test_overall_timeout_farm", project=project)
        # Create multiple hosts
        for i in range(10):
            farm.host_set.create(name=f"host{i}.example.com")

        # Simulate slow responses by sleeping longer than the timeout
        def slow_scrape(*args, **kwargs):
            time.sleep(5)  # Sleep longer than the mocked SCRAPE_TIMEOUT (2 seconds)
            response = requests.Response()
            response.status_code = 200
            response._content = b""
            return response
        
        mock_scrape.side_effect = slow_scrape

        body = {
            "target": "#exporterresult",
            "job": "foo",
            "port": 8000,
            "scheme": "http",
        }

        response = self.client.post(reverse("exporter-scrape", kwargs={"pk": project.pk}), body)
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains the overall timeout message
        data = response.json()
        self.assertIn("__timeout__", data, "Should have overall timeout key in response")
        self.assertIn("timed out", data["__timeout__"].lower())

    def test_failed_permission(self):
        # Test for redirect
        for request in [{"viewname": "rule-new", "args": ("site", 1)}]:
            response = self.client.get(reverse(**request))
            self.assertRoute(response, views.AlertRuleRegister, 302)
            self.assertTrue(response.url.startswith("/login"))

    def test_other_routes(self):
        self.add_user_permissions("promgen.add_rule", "promgen.change_site")
        for request in [{"viewname": "rule-new", "args": ("site", 1)}]:
            response = self.client.get(reverse(**request))
            self.assertRoute(response, views.AlertRuleRegister, 200)
