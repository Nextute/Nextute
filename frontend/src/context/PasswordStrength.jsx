import { AlertCircle, CheckCircle } from "lucide-react";




const PasswordStrength = ({ password }) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  const strength =
    (isLongEnough ? 1 : 0) +
    (hasLowercase ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecialChar ? 1 : 0);

  const PASSWORD_STRENGTH_LABELS = [
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];
  const PASSWORD_STRENGTH_COLORS = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600 ">
          Password strength:
        </span>
        <span className="text-xs font-medium text-gray-900">
          {PASSWORD_STRENGTH_LABELS[strength - 1] || "Weak"}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-200  rounded-full overflow-hidden">
        <div
          className={`${
            PASSWORD_STRENGTH_COLORS[strength - 1] || "bg-red-500"
          } h-full transition-all duration-300`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <div className="mt-2 space-y-1 text-gray-600  text-xs">
        <div className="flex items-center">
          {isLongEnough ? (
            <CheckCircle size={12} className="text-green-500 mr-1" />
          ) : (
            <AlertCircle size={12} className="text-red-500 mr-1" />
          )}
          <span>At least 8 characters long</span>
        </div>
        <div className="flex items-center">
          {hasLowercase ? (
            <CheckCircle size={12} className="text-green-500 mr-1" />
          ) : (
            <AlertCircle size={12} className="text-red-500 mr-1" />
          )}
          <span>At least one lowercase letter</span>
        </div>
        <div className="flex items-center">
          {hasUppercase ? (
            <CheckCircle size={12} className="text-green-500 mr-1" />
          ) : (
            <AlertCircle size={12} className="text-red-500 mr-1" />
          )}
          <span>At least one uppercase letter</span>
        </div>
        <div className="flex items-center">
          {hasNumber ? (
            <CheckCircle size={12} className="text-green-500 mr-1" />
          ) : (
            <AlertCircle size={12} className="text-red-500 mr-1" />
          )}
          <span>At least one number</span>
        </div>
        <div className="flex items-center">
          {hasSpecialChar ? (
            <CheckCircle size={12} className="text-green-500 mr-1" />
          ) : (
            <AlertCircle size={12} className="text-red-500 mr-1" />
          )}
          <span>At least one special character</span>
        </div>
      </div>
    </div>
  );
};


export default PasswordStrength;
