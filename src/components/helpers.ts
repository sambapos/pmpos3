export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : '',
    overflow: 'auto' as 'auto'
});

export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : '',
    // styles we need to apply on draggables
    ...draggableStyle,
});