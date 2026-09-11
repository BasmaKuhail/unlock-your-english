const login = async (id: string, password: string) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, password }),
        });
    } catch (error) {
        console.error("Error logging in:", error);
    }
}