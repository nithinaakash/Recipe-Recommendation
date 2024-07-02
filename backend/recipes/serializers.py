from rest_framework import serializers
from .models import SampleRecipe
import os

class RecipeListSerialzer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = SampleRecipe

    def get_image_url(self, obj):
        if obj.image_url.startswith('/static/'):
            file_name = obj.image_url.split('/')[-1]
            return 'https://{0}.s3.amazonaws.com/{1}'.format(os.environ.get('AWS_STORAGE_BUCKET_NAME'), file_name)
    image_url = serializers.SerializerMethodField(method_name='get_image_url')

class RecipeSearchHistorySerializer(serializers.Serializer):
    user_id = serializers.CharField()
    search_query = serializers.CharField()
    search_timestamp = serializers.DateTimeField()
    search_data = serializers.JSONField()
    