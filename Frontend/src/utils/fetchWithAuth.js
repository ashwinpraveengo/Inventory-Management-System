let csrfToken = null;

export const fetchCsrfToken = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/auth/csrf-token", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken;
    }
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
  return null;
};

export const fetchWithAuth = async (url, options = {}) => {
  // Always include credentials to send/receive HttpOnly cookies
  const modifiedOptions = {
    ...options,
    credentials: "include",
  };

  // If it's a mutating request, we need a CSRF token
  const method = modifiedOptions.method || "GET";
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase())) {
    if (!csrfToken) {
      await fetchCsrfToken();
    }
    
    modifiedOptions.headers = {
      ...modifiedOptions.headers,
      "CSRF-Token": csrfToken,
    };
  }

  return fetch(url, modifiedOptions);
};
