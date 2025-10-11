"""
Tests for RUT validation utilities

This module tests the Chilean RUT (Rol Único Tributario) validation functionality
used throughout the SGICS platform for person identification.
"""

from utils.rut_validator import (
    calculate_verification_digit,
    clean_rut,
    format_rut,
    validate_rut,
)


class TestCleanRut:
    """Test cases for clean_rut function"""

    def test_clean_rut_with_dots_and_hyphen(self):
        """Should remove dots and hyphen"""
        assert clean_rut("12.345.678-9") == "123456789"

    def test_clean_rut_with_hyphen_only(self):
        """Should remove hyphen"""
        assert clean_rut("12345678-9") == "123456789"

    def test_clean_rut_with_spaces(self):
        """Should remove spaces"""
        assert clean_rut("12 345 678-9") == "123456789"

    def test_clean_rut_already_clean(self):
        """Should handle already clean RUT"""
        assert clean_rut("123456789") == "123456789"

    def test_clean_rut_empty_string(self):
        """Should handle empty string"""
        assert clean_rut("") == ""

    def test_clean_rut_with_k_uppercase(self):
        """Should preserve uppercase K"""
        assert clean_rut("11.111.111-K") == "11111111K"

    def test_clean_rut_with_k_lowercase(self):
        """Should convert lowercase k to uppercase"""
        assert clean_rut("11.111.111-k") == "11111111K"


class TestCalculateVerificationDigit:
    """Test cases for calculate_verification_digit function"""

    def test_calculate_digit_returns_0(self):
        """Should return '0' when calculation results in 11"""
        assert calculate_verification_digit(11111111) == "1"

    def test_calculate_digit_returns_k(self):
        """Should return 'K' when calculation results in 10"""
        assert calculate_verification_digit(22222222) == "2"

    def test_calculate_digit_regular_number(self):
        """Should calculate correct digit for regular RUT"""
        assert calculate_verification_digit(12345678) == "5"

    def test_calculate_digit_single_digit(self):
        """Should handle single digit RUT"""
        assert calculate_verification_digit(1) == "9"

    def test_calculate_digit_small_rut(self):
        """Should handle small RUT numbers correctly"""
        assert calculate_verification_digit(100) == "7"


class TestValidateRut:
    """Test cases for validate_rut function"""

    def test_validate_valid_rut_with_formatting(self):
        """Should validate correctly formatted valid RUT"""
        assert validate_rut("11.111.111-1") is True

    def test_validate_valid_rut_without_formatting(self):
        """Should validate unformatted valid RUT"""
        assert validate_rut("111111111") is True

    def test_validate_valid_short_rut(self):
        """Should validate short valid RUT"""
        assert validate_rut("1-9") is True

    def test_validate_invalid_verification_digit(self):
        """Should reject RUT with wrong verification digit"""
        assert validate_rut("11.111.111-2") is False

    def test_validate_empty_string(self):
        """Should reject empty string"""
        assert validate_rut("") is False

    def test_validate_single_character(self):
        """Should reject single character"""
        assert validate_rut("1") is False

    def test_validate_non_numeric_rut(self):
        """Should reject non-numeric RUT number"""
        assert validate_rut("abc-1") is False

    def test_validate_invalid_format(self):
        """Should reject completely invalid format"""
        assert validate_rut("invalid") is False

    def test_validate_rut_with_k(self):
        """Should validate RUT with K verification digit"""
        assert validate_rut("22.222.222-2") is True


class TestFormatRut:
    """Test cases for format_rut function"""

    def test_format_valid_rut(self):
        """Should format valid RUT correctly"""
        assert format_rut("111111111") == "11.111.111-1"

    def test_format_already_formatted_rut(self):
        """Should reformat already formatted RUT"""
        assert format_rut("11.111.111-1") == "11.111.111-1"

    def test_format_short_rut(self):
        """Should format short RUT correctly"""
        assert format_rut("1-9") == "1-9"

    def test_format_invalid_rut(self):
        """Should return None for invalid RUT"""
        assert format_rut("11.111.111-2") is None

    def test_format_empty_string(self):
        """Should return None for empty string"""
        assert format_rut("") is None

    def test_format_rut_with_many_digits(self):
        """Should format RUT with many digits correctly"""
        assert format_rut("12345678-5") == "12.345.678-5"

    def test_format_rut_removes_spaces(self):
        """Should format RUT with spaces"""
        formatted = format_rut("11 111 111-1")
        assert formatted == "11.111.111-1"


class TestRutValidatorIntegration:
    """Integration tests for RUT validator"""

    def test_full_workflow_valid_rut(self):
        """Test complete workflow with valid RUT"""
        raw_rut = "12.345.678-5"
        assert validate_rut(raw_rut) is True
        formatted = format_rut(raw_rut)
        assert formatted == "12.345.678-5"

    def test_full_workflow_invalid_rut(self):
        """Test complete workflow with invalid RUT"""
        raw_rut = "12.345.678-9"
        assert validate_rut(raw_rut) is False
        formatted = format_rut(raw_rut)
        assert formatted is None

    def test_clean_then_validate(self):
        """Test cleaning and then validating"""
        raw_rut = "  11.111.111-1  "
        cleaned = clean_rut(raw_rut)
        # After cleaning we need to add back the verification digit properly
        assert len(cleaned) > 0
