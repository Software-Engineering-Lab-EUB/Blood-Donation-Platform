export const createRoom = (user1: string, user2: string) => {
    const sortedIds = [user1, user2].sort();
    const roomId = `${sortedIds[0]}${sortedIds[1]}`;
    return roomId;
}