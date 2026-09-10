import datetime
import uuid

from django.db import migrations
from django.utils import timezone
from knox.crypto import hash_token
from knox.settings import CONSTANTS

from promgen import settings


def migrate_drf_tokens_to_knox(apps, schema_editor):
    AuthToken = apps.get_model("promgen", "AuthToken")
    User = apps.get_model("auth", "User")
    expiration_days = getattr(settings, "API_TOKEN_TTL_DAYS", None)

    if "authtoken_token" not in schema_editor.connection.introspection.table_names():
        return

    with schema_editor.connection.cursor() as cursor:
        cursor.execute("SELECT t.key, t.user_id, t.created FROM authtoken_token t;")
        drf_tokens = cursor.fetchall()

        for key, user_id, created in drf_tokens:
            expiry = (
                timezone.now() + datetime.timedelta(days=expiration_days)
                if expiration_days
                else None
            )
            token_key = key[: CONSTANTS.TOKEN_KEY_LENGTH]
            digest = hash_token(key)

            auth_token, _ = AuthToken.objects.get_or_create(
                digest=digest,
                defaults={
                    "user_id": user_id,
                    "token_key": token_key,
                    "expiry": expiry,
                    "name": f"{User.objects.get(pk=user_id).username}-{uuid.uuid4()}",
                },
            )

            auth_token.created = created
            auth_token.save()


class Migration(migrations.Migration):
    dependencies = [
        ("knox", "0009_extend_authtoken_field"),
        ("promgen", "0049_authtoken"),
    ]

    operations = [
        # Step 1: Migrate DRF tokens into Knox tokens
        migrations.RunPython(migrate_drf_tokens_to_knox, reverse_code=migrations.RunPython.noop),
        # Step 2: Drop the DRF token table
        migrations.RunSQL(
            sql="DROP TABLE IF EXISTS authtoken_token;",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
