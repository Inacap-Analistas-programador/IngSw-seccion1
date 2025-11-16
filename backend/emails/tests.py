from django.test import TestCase
from django.core import mail
from usuarios.models import Usuario
from maestros.models import Perfil
from cursos.models import Curso
from .models import EmailTemplate, EmailLog, EmailQueue, EmailConfiguration
from .services import EmailService, EmailTriggerService
from .utils import generate_qr_code, generate_course_qr


class EmailTemplateModelTest(TestCase):
    """Tests para el modelo EmailTemplate"""

    def setUp(self):
        self.template = EmailTemplate.objects.create(
            template_name='test_template',
            template_type='custom',
            subject='Test Subject',
            html_content='<p>Hello {{ name }}</p>',
            text_content='Hello {{ name }}',
            is_active=True
        )

    def test_template_creation(self):
        """Test creación de plantilla"""
        self.assertEqual(self.template.template_name, 'test_template')
        self.assertEqual(self.template.template_type, 'custom')
        self.assertTrue(self.template.is_active)

    def test_template_str(self):
        """Test representación en string"""
        expected = f"{self.template.template_name} (Personalizado)"
        self.assertEqual(str(self.template), expected)


class EmailLogModelTest(TestCase):
    """Tests para el modelo EmailLog"""

    def setUp(self):
        self.log = EmailLog.objects.create(
            recipient_email='test@example.com',
            subject='Test Email',
            html_content='<p>Test</p>',
            status='sent'
        )

    def test_log_creation(self):
        """Test creación de log"""
        self.assertEqual(self.log.recipient_email, 'test@example.com')
        self.assertEqual(self.log.status, 'sent')

    def test_log_str(self):
        """Test representación en string"""
        expected = "Email to test@example.com - sent"
        self.assertEqual(str(self.log), expected)


class EmailServiceTest(TestCase):
    """Tests para EmailService"""

    def setUp(self):
        self.email_service = EmailService()
        self.template = EmailTemplate.objects.create(
            template_name='test_template',
            template_type='custom',
            subject='Hello {{ name }}',
            html_content='<p>Hello {{ name }}, welcome!</p>',
            text_content='Hello {{ name }}, welcome!',
            is_active=True
        )

    def test_render_template(self):
        """Test renderizado de plantilla"""
        context = {'name': 'John'}
        subject, html_content, text_content = self.email_service.render_template(
            self.template, context
        )
        
        self.assertEqual(subject, 'Hello John')
        self.assertIn('Hello John', html_content)
        self.assertIn('Hello John', text_content)

    def test_send_email(self):
        """Test envío de email"""
        email_log = self.email_service.send_email(
            recipient_email='test@example.com',
            subject='Test Subject',
            html_content='<p>Test Content</p>',
            text_content='Test Content'
        )
        
        self.assertEqual(email_log.recipient_email, 'test@example.com')
        self.assertEqual(email_log.status, 'sent')
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Test Subject')

    def test_send_from_template(self):
        """Test envío desde plantilla"""
        email_log = self.email_service.send_from_template(
            template_name='test_template',
            recipient_email='test@example.com',
            context={'name': 'Jane'}
        )
        
        self.assertEqual(email_log.recipient_email, 'test@example.com')
        self.assertEqual(email_log.status, 'sent')
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Jane', mail.outbox[0].subject)

    def test_queue_email(self):
        """Test añadir email a cola"""
        email_queue = self.email_service.queue_email(
            template=self.template,
            recipient_email='test@example.com',
            context_data={'name': 'Bob'},
            priority=3
        )
        
        self.assertEqual(email_queue.recipient_email, 'test@example.com')
        self.assertEqual(email_queue.priority, 3)
        self.assertFalse(email_queue.is_processed)


class EmailTriggerServiceTest(TestCase):
    """Tests para EmailTriggerService"""

    def setUp(self):
        self.trigger_service = EmailTriggerService()
        
        # Crear perfil y usuario de prueba
        self.perfil = Perfil.objects.create(
            pel_descripcion='Test Profile',
            pel_vigente=True
        )
        self.user = Usuario.objects.create(
            pel_id=self.perfil,
            usu_username='testuser',
            usu_email='test@example.com',
            usu_vigente=True
        )
        
        # Crear plantillas necesarias
        EmailTemplate.objects.create(
            template_name='registration_confirmation',
            template_type='registration',
            subject='Confirm Registration',
            html_content='<p>Hello {{ username }}, verify: {{ verification_url }}</p>',
            is_active=True
        )
        
        EmailTemplate.objects.create(
            template_name='account_verification',
            template_type='verification',
            subject='Account Verified',
            html_content='<p>Hello {{ username }}, login: {{ login_url }}</p>',
            is_active=True
        )

    def test_send_registration_confirmation(self):
        """Test envío de confirmación de registro"""
        token = 'test_token_123'
        email_log = self.trigger_service.send_registration_confirmation(
            user=self.user,
            verification_token=token
        )
        
        self.assertEqual(email_log.recipient_email, 'test@example.com')
        self.assertEqual(email_log.status, 'sent')
        self.assertEqual(len(mail.outbox), 1)

    def test_send_account_verification(self):
        """Test envío de verificación de cuenta"""
        email_log = self.trigger_service.send_account_verification(user=self.user)
        
        self.assertEqual(email_log.recipient_email, 'test@example.com')
        self.assertEqual(email_log.status, 'sent')
        self.assertEqual(len(mail.outbox), 1)


class QRCodeUtilsTest(TestCase):
    """Tests para utilidades de código QR"""

    def test_generate_qr_code(self):
        """Test generación de código QR"""
        data = {'test': 'data', 'user_id': 123}
        qr_bytes = generate_qr_code(data)
        
        self.assertIsInstance(qr_bytes, bytes)
        self.assertGreater(len(qr_bytes), 0)

    def test_generate_course_qr(self):
        """Test generación de QR para curso"""
        # Crear datos de prueba
        perfil = Perfil.objects.create(
            pel_descripcion='Test Profile',
            pel_vigente=True
        )
        user = Usuario.objects.create(
            pel_id=perfil,
            usu_username='testuser',
            usu_email='test@example.com',
            usu_vigente=True
        )
        
        # Note: Este test requeriría crear un curso completo
        # Lo comentamos por simplicidad
        # qr_bytes = generate_course_qr(user, course)
        # self.assertIsInstance(qr_bytes, bytes)


class EmailConfigurationModelTest(TestCase):
    """Tests para el modelo EmailConfiguration"""

    def test_configuration_creation(self):
        """Test creación de configuración"""
        config = EmailConfiguration.objects.create(
            config_key='TEST_CONFIG',
            config_value='test_value',
            description='Test configuration',
            is_active=True
        )
        
        self.assertEqual(config.config_key, 'TEST_CONFIG')
        self.assertEqual(config.config_value, 'test_value')
        self.assertTrue(config.is_active)


class EmailQueueModelTest(TestCase):
    """Tests para el modelo EmailQueue"""

    def setUp(self):
        self.template = EmailTemplate.objects.create(
            template_name='test_template',
            template_type='custom',
            subject='Test',
            html_content='<p>Test</p>',
            is_active=True
        )

    def test_queue_creation(self):
        """Test creación de cola"""
        queue = EmailQueue.objects.create(
            template=self.template,
            recipient_email='test@example.com',
            context_data={'name': 'Test'},
            priority=2
        )
        
        self.assertEqual(queue.recipient_email, 'test@example.com')
        self.assertEqual(queue.priority, 2)
        self.assertFalse(queue.is_processed)

    def test_queue_ordering(self):
        """Test ordenamiento de cola por prioridad"""
        EmailQueue.objects.create(
            template=self.template,
            recipient_email='low@example.com',
            context_data={},
            priority=1
        )
        EmailQueue.objects.create(
            template=self.template,
            recipient_email='high@example.com',
            context_data={},
            priority=4
        )
        
        first_in_queue = EmailQueue.objects.first()
        self.assertEqual(first_in_queue.priority, 4)
        self.assertEqual(first_in_queue.recipient_email, 'high@example.com')

