"""
RUT validation utilities for Chilean RUT (Rol Único Tributario)
Used across the SGICS platform for person identification
"""

import re
from typing import Optional


def clean_rut(rut: str) -> str:
    """
    Clean RUT string by removing dots, hyphens and converting to uppercase

    Args:
        rut: Raw RUT string (e.g., "12.345.678-9", "12345678-9")

    Returns:
        Cleaned RUT string (e.g., "123456789")
    """
    if not rut:
        return ""

    # Remove dots, hyphens, and spaces, convert to uppercase
    cleaned = re.sub(r"[.\-\s]", "", str(rut)).upper()
    return cleaned


def validate_rut(rut: str) -> bool:
    """
    Validate Chilean RUT using the verification digit algorithm

    Args:
        rut: RUT string to validate

    Returns:
        True if RUT is valid, False otherwise
    """
    try:
        cleaned_rut = clean_rut(rut)

        # RUT must have at least 2 characters (number + verification digit)
        if len(cleaned_rut) < 2:
            return False

        # Extract number and verification digit
        rut_number = cleaned_rut[:-1]
        verification_digit = cleaned_rut[-1]

        # RUT number must be numeric
        if not rut_number.isdigit():
            return False

        # Calculate verification digit
        calculated_digit = calculate_verification_digit(int(rut_number))

        return verification_digit == calculated_digit

    except (ValueError, IndexError):
        return False


def calculate_verification_digit(rut_number: int) -> str:
    """
    Calculate the verification digit for a given RUT number

    Args:
        rut_number: Numeric part of the RUT

    Returns:
        Verification digit as string ('0'-'9' or 'K')
    """
    factors = [2, 3, 4, 5, 6, 7]
    sum_value = 0

    # Convert to string to process digit by digit from right to left
    rut_str = str(rut_number)

    for i, digit in enumerate(reversed(rut_str)):
        factor = factors[i % len(factors)]
        sum_value += int(digit) * factor

    remainder = sum_value % 11
    verification = 11 - remainder

    if verification == 11:
        return "0"
    elif verification == 10:
        return "K"
    else:
        return str(verification)


def format_rut(rut: str) -> Optional[str]:
    """
    Format RUT string with standard Chilean format (12.345.678-9)

    Args:
        rut: RUT string to format

    Returns:
        Formatted RUT string or None if invalid
    """
    if not validate_rut(rut):
        return None

    cleaned = clean_rut(rut)
    rut_number = cleaned[:-1]
    verification_digit = cleaned[-1]

    # Add dots every 3 digits from right to left
    formatted_number = ""
    for i, digit in enumerate(reversed(rut_number)):
        if i > 0 and i % 3 == 0:
            formatted_number = "." + formatted_number
        formatted_number = digit + formatted_number

    return f"{formatted_number}-{verification_digit}"


# Example usage and test cases
if __name__ == "__main__":
    # Test cases
    test_ruts = [
        "11.111.111-1",  # Valid
        "12.345.678-9",  # Valid
        "1-9",  # Valid
        "12345678-9",  # Valid (no dots)
        "11.111.111-2",  # Invalid
        "invalid",  # Invalid
        "",  # Invalid
    ]

    for test_rut in test_ruts:
        is_valid = validate_rut(test_rut)
        formatted = format_rut(test_rut) if is_valid else "Invalid"
        print(f"RUT: {test_rut:15} -> Valid: {is_valid:5} -> Formatted: {formatted}")
