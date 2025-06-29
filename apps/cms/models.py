from django.db import models


class Service(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon_class = models.CharField(
        max_length=255, help_text="Enter the icon class from font awesome"
    )
    button_text = models.CharField(max_length=255)
    button_link = models.URLField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
        ordering = ["id"]


class Features(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon_class = models.CharField(
        max_length=255, help_text="Enter the icon class from font awesome"
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Feature"
        verbose_name_plural = "Features"
        ordering = ["id"]


class TrainSchedule(models.Model):
    train_number = models.CharField(max_length=255)
    from_station = models.CharField(max_length=255)
    to_station = models.CharField(max_length=255)
    time = models.TimeField(help_text="Enter the time in 24 hour format")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.train_number

    class Meta:
        verbose_name = "Train Schedule"
        verbose_name_plural = "Train Schedules"
        ordering = ["id"]


class UpdateCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Update Category"
        verbose_name_plural = "Update Categories"
        ordering = ["id"]


class Updates(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to="updates/")
    description = models.TextField()
    category = models.ForeignKey(
        UpdateCategory, on_delete=models.CASCADE, related_name="updates"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Update"
        verbose_name_plural = "Updates"
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["category"]),
        ]
