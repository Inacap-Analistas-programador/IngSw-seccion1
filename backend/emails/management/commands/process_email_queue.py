from django.core.management.base import BaseCommand
from emails.services import EmailService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Procesa la cola de correos electrónicos pendientes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=10,
            help='Número de correos a procesar en cada lote (default: 10)'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']
        
        self.stdout.write(f'Procesando cola de emails (batch_size={batch_size})...')
        
        try:
            email_service = EmailService()
            email_service.process_queue(batch_size=batch_size)
            
            self.stdout.write(
                self.style.SUCCESS(f'✓ Cola procesada exitosamente (hasta {batch_size} emails)')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Error procesando cola: {str(e)}')
            )
            logger.error(f"Error processing email queue: {str(e)}")
            raise
