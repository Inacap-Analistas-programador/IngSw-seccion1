from django.db import models
from django.conf import settings
import os
import mimetypes


class File(models.Model):
    filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    type = models.CharField(max_length=100, blank=True)
    size = models.BigIntegerField(blank=True, null=True)  # Size in bytes
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    related_to = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename or (self.file.name if self.file else '')

    def save(self, *args, **kwargs):
        # Populate filename from the FileField if missing
        if self.file and (not self.filename):
            self.filename = os.path.basename(self.file.name)

        # Populate size if missing
        if self.file and not self.size:
            try:
                # FileField may provide file.size when available
                self.size = self.file.size
            except Exception:
                pass

        # Guess type if missing
        if self.file and (not self.type):
            file_type, _ = mimetypes.guess_type(getattr(self.file, 'name', None) or self.filename)
            self.type = file_type or 'application/octet-stream'

        super().save(*args, **kwargs)
