from django.http import JsonResponse

def health_check(request):
    """
    A simple health check endpoint that returns a 200 OK response.
    """
    return JsonResponse({'status': 'ok'})
