

from utils.rut_validator import (
    calculate_verification_digit,
    clean_rut,
    format_rut,
    validate_rut,
)


class TestCleanRut:
    """Test cases for clean_rut function"""

    def test_clean_rut_with_dots_and_hyphen(self):
        assert clean_rut("12.345.678-9") == "123456789"

    def test_clean_rut_with_hyphen_only(self):
        assert clean_rut("12345678-9") == "123456789"

    def test_clean_rut_with_spaces(self):
        assert clean_rut("12 345 678-9") == "123456789"

    def test_clean_rut_already_clean(self):
        assert clean_rut("123456789") == "123456789"

    def test_clean_rut_empty_string(self):
        assert clean_rut("") == ""

    def test_clean_rut_with_k_uppercase(self):
        assert clean_rut("11.111.111-K") == "11111111K"

    def test_clean_rut_with_k_lowercase(self):
        assert clean_rut("11.111.111-k") == "11111111K"


class TestCalculateVerificationDigit:
    def test_calculate_digit_returns_0(self):
        assert calculate_verification_digit(11111111) == "1"

    def test_calculate_digit_returns_k(self):
        assert calculate_verification_digit(22222222) == "2"

    def test_calculate_digit_regular_number(self):
        assert calculate_verification_digit(12345678) == "5"

    def test_calculate_digit_single_digit(self):
        assert calculate_verification_digit(1) == "9"

    def test_calculate_digit_small_rut(self):
        assert calculate_verification_digit(100) == "7"


class TestValidateRut:
    def test_validate_valid_rut_with_formatting(self):
        assert validate_rut("11.111.111-1") is True

    def test_validate_valid_rut_without_formatting(self):
        assert validate_rut("111111111") is True

    def test_validate_valid_short_rut(self):
        assert validate_rut("1-9") is True

    def test_validate_invalid_verification_digit(self):
        assert validate_rut("11.111.111-2") is False

    def test_validate_empty_string(self):
        assert validate_rut("") is False

    def test_validate_single_character(self):
        assert validate_rut("1") is False

    def test_validate_non_numeric_rut(self):
        assert validate_rut("abc-1") is False

    def test_validate_invalid_format(self):
        assert validate_rut("invalid") is False

    def test_validate_rut_with_k(self):
        assert validate_rut("22.222.222-2") is True


class TestFormatRut:
    def test_format_valid_rut(self):
        assert format_rut("111111111") == "11.111.111-1"

    def test_format_already_formatted_rut(self):
        assert format_rut("11.111.111-1") == "11.111.111-1"

    def test_format_short_rut(self):
        assert format_rut("1-9") == "1-9"

    def test_format_invalid_rut(self):
        assert format_rut("11.111.111-2") is None

    def test_format_empty_string(self):
        assert format_rut("") is None

    def test_format_rut_with_many_digits(self):
        assert format_rut("12345678-5") == "12.345.678-5"

    def test_format_rut_removes_spaces(self):
        formatted = format_rut("11 111 111-1")
        assert formatted == "11.111.111-1"


class TestRutValidatorIntegration:
    def test_full_workflow_valid_rut(self):
        raw_rut = "12.345.678-5"
        assert validate_rut(raw_rut) is True
        formatted = format_rut(raw_rut)
        assert formatted == "12.345.678-5"

    def test_full_workflow_invalid_rut(self):
        raw_rut = "12.345.678-9"
        assert validate_rut(raw_rut) is False
        formatted = format_rut(raw_rut)
        assert formatted is None

    def test_clean_then_validate(self):
        raw_rut = "  11.111.111-1  "
        cleaned = clean_rut(raw_rut)
        assert len(cleaned) > 0
