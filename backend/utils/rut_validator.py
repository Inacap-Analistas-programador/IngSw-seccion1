import re


def clean_rut(rut):
    """Limpia un RUT, eliminando puntos y guiones."""
    return re.sub(r"[\.\-]", "", str(rut)).upper()


def format_rut(rut):
    """Formatea un RUT con puntos y guión."""
    rut = clean_rut(rut)
    if not rut:
        return ""

    body = rut[:-1]
    verifier = rut[-1]

    # Formatear cuerpo con puntos
    body_formatted = ".".join(
        [body[max(i - 3, 0) : i] for i in range(len(body), 0, -3)][::-1]
    )

    return f"{body_formatted}-{verifier}"


def validate_rut(rut):
    """Valida un RUT chileno."""
    rut = clean_rut(rut)
    if not rut or not re.match(r"^\d{1,8}[0-9K]$", rut):
        return False

    body = rut[:-1]
    verifier = rut[-1]

    try:
        body_int = int(body)
    except ValueError:
        return False

    # Cálculo del dígito verificador
    reversed_digits = map(int, reversed(str(body_int)))
    factors = [2, 3, 4, 5, 6, 7] * (len(body) // 6 + 1)
    s = sum(d * f for d, f in zip(reversed_digits, factors))

    expected_verifier = (-s) % 11

    if str(expected_verifier) == verifier:
        return True
    if expected_verifier == 10 and verifier == "K":
        return True

    return False
