// File containing data functions
export function shuffleData(state_data) {
    const dataLen = state_data.length;
    for(let i=dataLen - 1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state_data[i], state_data[j]] = [state_data[j], state_data[i]];
    };
    return;
};

export async function fetchData() {
    const response = await fetch('./data.json');
    if (!response.ok) {
        throw new Error('Failed to load quiz data.');
    };
    return await response.json();
};
