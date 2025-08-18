export const isJwtExpired = (token: string): boolean => {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return false; // Not a JWT; cannot assert expiration
		const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
		if (typeof payload.exp !== 'number') return false;
		const nowInSeconds = Math.floor(Date.now() / 1000);
		return payload.exp <= nowInSeconds;
	} catch {
		return false;
	}
};


