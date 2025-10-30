from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class EmailForwarderView(APIView):
    def post(self, request, *args, **kwargs):
        from_email = request.data.get('from')
        to_email = request.data.get('to')
        subject = request.data.get('subject')
        body = request.data.get('body')

        if not all([from_email, to_email, subject, body]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(
                subject,
                body,
                from_email,
                [to_email],
                fail_silently=False,
            )
            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
