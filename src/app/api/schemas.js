const { schema } = require('normalizr');

export const course = new schema.Entity('courses');
export const question = new schema.Entity('questions');
export const section = new schema.Entity('sections', {questions:[question]});
export const mainQuestion = new schema.Entity('mainQuestions', {sections:[section]});
export const test = new schema.Entity('tests', {main_questions:[mainQuestion]});
export const attempted = new schema.Entity('attempted');
export const dashboard = new schema.Entity('dashboard');

export const attempt = new schema.Entity('attempts');



export const transaction = new schema.Entity('transactions');
