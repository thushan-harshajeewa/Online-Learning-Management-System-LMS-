# Generated by Django 5.0 on 2024-01-09 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0008_rename_pdf_coursetutorials_video_coursedocuments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursedocuments',
            name='pdf',
            field=models.FileField(upload_to='store/course/documents'),
        ),
    ]
