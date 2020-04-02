export { get_parent, make_list };

function get_parent(current, parent) {
    while ( current.parentNode &&  current.tagName !== parent ) {
        current =  current.parentNode;
    }
    if (current.tagName !== parent) {
        throw new Error(' no ' +  parent +' tag found as an ancestor ');
    }
    return current;
}

/**
 *
 *
 */
function make_list(categories) {
    if (!categories) {
        throw new Error(' categories undefined!');
    }
    if (typeof categories !== 'object' ) {
        throw new Error(' categories must be a json object ');
    }

    let list = ``;
    let x = {};
    for (x of categories) {
        list += `<option value="${x.id}">${x.name}`;
    }
    return list;
}
