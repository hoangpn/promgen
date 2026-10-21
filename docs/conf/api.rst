Configuring Promgen API
=======================

Promgen API configuration is configurable via environment variables.

The following settings are available:


API_TOKEN_MAX_QUOTA
-------------------
[Integer | default = None]

Number of tokens a user is allowed to create. The default is None, which means unlimited.

*This setting applies to API token creation on the Promgen Site and API endpoint but is not enforced
on the Django Admin Site. The Promgen Admin can create tokens on the Django Admin Site without restrictions.*


API_TOKEN_TTL_DAYS
-------------------
[Integer | default = None]

Maximum number of days an API token is valid for. When set, Promgen will not allow the creation of
API tokens with expiry greater than this setting. The default is None, which means unlimited.

*This setting applies to API token creation on the Promgen Site and API endpoint but is not enforced
on the Django Admin Site. The Promgen Admin can create tokens on the Django Admin Site without restrictions.*


PROMGEN_EXPORTER_TEST_MAX_HOSTS
-------------------------------
[Integer | default = 50]

Maximum number of hosts that can be tested in one request to
``POST /rest/v2/exporters/{exporter_id}/test``. Set the ``PROMGEN_EXPORTER_TEST_MAX_HOSTS``
environment variable to change the limit. If the selected host count exceeds this limit, the API
returns HTTP 400 before starting any scrapes. This applies to both explicit host lists and the
default hosts selected for a saved exporter.


V2_API_LOGGING_ENABLED
-----------------------
[Boolean | default = True]

This setting enables logging of all V2 API (endpoints starts with "/rest/v2/") requests and
responses, providing a clear record of actions performed through these APIs.

For requests, the method, path, and request body are logged. However, fields in the request body
are truncated to avoid filling up the log. By default, the character limit is set to 128, but fields
like "clause" are still logged in full as they are necessary. For responses, only the status and
response content size are logged. A unique trace ID is generated to link the request and response logs.
