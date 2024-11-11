function intersection(...arrays) {
    // Your implementation here

    //checking of the no of array is 0 or 1 then whatever the element is given in the only array will be the answer
    if (arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];
    let result = new Set(arrays[0]);

    //now we need to check which elements of the first array are found in others
    for (i = 1; i < arrays.length; i++) {
        const currentSet = new Set(array[i]);

        result = new Set([...result].filter((el) => currentSet.has(el)));

        //early termination
        if (result.size === 0) {
            return [];
        }
    }

    return Array.from(result);
}
