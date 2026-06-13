"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    // 1. Delete the secure cookie we created earlier
    document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 2. Force a hard reload back to the login page
    window.location.href = "/admin/login";
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors"
    >
      Logout
    </button>
  );
}