export function applyGlobalSearch(data: any[], searchText: string, fieldsToSearch: string[]): any[] {
    if (!searchText || searchText === '') {
        return data; // Return the original data if no search text
    }
    
    const filterValue = searchText.toLowerCase();
    
    return data.filter(item => {
        return fieldsToSearch.some(field => {
            const fieldValue = item[field];
            
            // Convert fieldValue to string and then lowercase if it's a string or number
            if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
                return fieldValue.toString().toLowerCase().includes(filterValue);
            }
            
            return false; // Return false for other data types
        });
    });
}
