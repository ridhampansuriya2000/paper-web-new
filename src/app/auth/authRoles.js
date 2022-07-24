/**
 * Authorization Roles
 */
const authRoles = {
    TEACHER: ['TEACHER'],
    STUDENT: ['STUDENT'],
    USER: ['TEACHER', 'STUDENT'],
    onlyGuest: [],
};

export default authRoles;
