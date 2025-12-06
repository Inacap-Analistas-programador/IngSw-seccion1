from django.core.management.base import BaseCommand


def run():
    from pagos.models import PagoPersona
    print("Checking for orphan payments (no per_id)...")
    orphans = PagoPersona.objects.filter(per_id__isnull=True)
    count = orphans.count()
    
    if count > 0:
        print(f"Found {count} orphan payments.")
        for p in orphans:
            print(f"Deleting Payment ID: {p.pap_id}, Valor: {p.pap_valor}, Obs: {p.pap_observacion}")
        
        # Uncomment to actually delete
        orphans.delete()
        print("Deleted all orphan payments.")
    else:
        print("No orphan payments found.")

if __name__ == "__main__":
    import os
    import sys
    import django
    
    # Add the project root (parent of 'scripts') to sys.path
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_path = os.path.join(project_root, 'backend')
    sys.path.append(backend_path)
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
    django.setup()
    
    run()
