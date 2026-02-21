export function validateExecutiveEntry(input) {
  const errors = [];
  const rating = Number(input.rating);
  const wageRate = Number(input.wageRateInRupee);

  if (!input.agencyName?.trim()) errors.push("Agency name is required.");
  if (!input.skill?.trim()) errors.push("Skill is required.");
  if (!Number.isInteger(Number(input.teamSize)) || Number(input.teamSize) <= 0) {
    errors.push("Team size must be a positive integer.");
  }
  if (!Number.isFinite(wageRate) || wageRate <= 0) {
    errors.push("Wage rate in rupee must be a positive number.");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push("Rating must be an integer between 1 and 5.");
  }
  if (!input.remarks?.trim()) errors.push("Remarks are required.");

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateSupplierProfile(input) {
  const errors = [];

  if (!input.agencyName?.trim()) errors.push("Agency name is required.");
  if (!input.mobileNumber?.trim()) errors.push("Mobile number is required.");
  if (!input.landlineNumber?.trim()) errors.push("Landline number is required.");
  if (!Number.isInteger(Number(input.teamSize)) || Number(input.teamSize) <= 0) {
    errors.push("Team size must be a positive integer.");
  }
  if (!input.skill?.trim()) errors.push("Skill is required.");
  if (!input.address?.trim()) errors.push("Address is required.");
  if (!input.state?.trim()) errors.push("State is required.");

  const mobileRegex = /^[0-9]{10}$/;
  if (input.mobileNumber && !mobileRegex.test(input.mobileNumber.trim())) {
    errors.push("Mobile number must be 10 digits.");
  }

  const landlineRegex = /^[0-9-]{6,15}$/;
  if (input.landlineNumber && !landlineRegex.test(input.landlineNumber.trim())) {
    errors.push("Landline number format is invalid.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
