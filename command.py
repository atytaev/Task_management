docker exec -i ppe_manager python manage.py shell <<'EOF'
from types import SimpleNamespace
import app.tasks as t
from app.models import Statistic

# получатель — только я
t.NotificationEmail = SimpleNamespace(objects=SimpleNamespace(
    filter=lambda **kw: [SimpleNamespace(email="Artem.Tutaev@sgs.com")]))

# проверка "нарушения сегодня" всегда True, график строится по реальным данным
def _filter(**kw):
    if "alert_time__date" in kw:
        return SimpleNamespace(exists=lambda: True)
    return Statistic.objects.filter(**kw)
t.Statistic = SimpleNamespace(objects=SimpleNamespace(filter=_filter))

t.send_report()
EOF
