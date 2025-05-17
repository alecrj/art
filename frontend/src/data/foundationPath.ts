// frontend/src/data/foundationPath.ts
export const foundationPath = {
    id: 'foundation_builder',
    title: 'Foundation Builder',
    description: 'Build your artistic confidence with foundational skills and techniques.',
    level: 'Beginner',
    lessons: [
      {
        id: 'your-first-circle',
        title: 'Your First Circle',
        description: 'Learn to draw confident, smooth circles - the building block of many drawings.',
        type: 'quickDraw',
        xpReward: 20,
        content: {
          instructions: 'Draw a circle as smoothly as you can. Focus on making one confident stroke.',
          timeLimit: 30, // seconds
          template: null, // No template for this exercise
          examples: [
            {
              imageUrl: 'https://example.com/circle-example-1.jpg',
              caption: 'Good circle with confident stroke'
            },
            {
              imageUrl: 'https://example.com/circle-example-2.jpg',
              caption: 'Circle with multiple strokes - try for one smooth motion'
            }
          ],
          successCriteria: [
            'Circle is reasonably round',
            'Stroke is confident and smooth',
            'Starting and ending points connect well'
          ]
        }
      },
      {
        id: 'circle-theory',
        title: 'Circle Theory',
        description: 'Understand the principles behind perfect circles and why they matter in art.',
        type: 'multipleChoice',
        xpReward: 15,
        content: {
          introduction: 'Circles are fundamental to art. Let\'s explore some core concepts!',
          questions: [
            {
              question: 'What makes a circle perfect?',
              options: [
                'All points are equidistant from the center',
                'It has straight lines only',
                'It has at least four corners',
                'It must be drawn clockwise'
              ],
              correctOptionIndex: 0,
              explanation: 'A perfect circle has all points equidistant from the center point, creating a perfectly round shape.'
            },
            {
              question: 'Why are circles important in art?',
              options: [
                'They\'re only used in modern art',
                'They form the basis of many shapes and forms',
                'They\'re easier to draw than straight lines',
                'They're only important in digital art'
              ],
              correctOptionIndex: 1,
              explanation: 'Circles form the foundation of many shapes and organic forms. They appear throughout nature and art!'
            },
            {
              question: 'Which drawing motion typically produces the best circles?',
              options: [
                'Multiple short, careful strokes',
                'Drawing very slowly',
                'A single confident motion using your arm',
                'Using only wrist movement'
              ],
              correctOptionIndex: 2,
              explanation: 'Drawing from your shoulder in one confident motion typically produces smoother, more accurate circles.'
            }
          ],
          requiredCorrect: 2 // Need at least 2 correct to pass
        }
      },
      {
        id: 'circle-practice',
        title: 'Circle Practice',
        description: 'Apply what you\'ve learned by practicing circles in your sketchbook.',
        type: 'realPractice',
        xpReward: 25,
        content: {
          introduction: 'Time to practice in your sketchbook! This exercise will help develop your muscle memory.',
          instructions: [
            'Take out your sketchbook and a pencil or pen',
            'Draw a row of 5 circles, trying to make each one smoother than the last',
            'Focus on using your arm, not just your wrist',
            'Try drawing both clockwise and counterclockwise',
            'Draw at least 2 rows of circles'
          ],
          timeEstimate: '5 minutes',
          tips: [
            'Relax your grip - tension makes wobbly circles',
            'Focus on the circle as a whole, not just where your pencil is',
            'Draw faster rather than slower for smoother results',
            'It\'s okay if they\'re not perfect!'
          ],
          completionCriteria: 'Take a photo of your practice and upload it, or simply mark this lesson as complete when you\'ve practiced for about 5 minutes.'
        }
      },
      {
        id: 'confident-lines',
        title: 'Confident Lines',
        description: 'Build on your circle skills by mastering straight and curved lines.',
        type: 'quickDraw',
        xpReward: 20,
        content: {
          instructions: 'Draw four straight lines connecting the dots below. Focus on confident, smooth strokes.',
          timeLimit: 30, // seconds
          template: 'line-dots-template', // Reference to a template with dots
          examples: [
            {
              imageUrl: 'https://example.com/lines-example-1.jpg',
              caption: 'Confident, straight lines connecting dots'
            },
            {
              imageUrl: 'https://example.com/lines-example-2.jpg',
              caption: 'Wobbly lines - try to make smoother strokes'
            }
          ],
          successCriteria: [
            'Lines are reasonably straight',
            'Strokes are confident and smooth',
            'Lines connect the dots accurately'
          ]
        }
      },
      {
        id: 'basic-shapes',
        title: 'Basic Shapes',
        description: 'Combine circles and lines to create fundamental shapes for drawing.',
        type: 'quickDraw',
        xpReward: 25,
        content: {
          instructions: 'Draw a square, triangle, and rectangle. Focus on making clean, confident shapes.',
          timeLimit: 45, // seconds
          template: null, // No template for this exercise
          examples: [
            {
              imageUrl: 'https://example.com/shapes-example-1.jpg',
              caption: 'Clean, well-proportioned basic shapes'
            },
            {
              imageUrl: 'https://example.com/shapes-example-2.jpg',
              caption: 'Shapes with inconsistent proportions'
            }
          ],
          successCriteria: [
            'Square has four equal sides',
            'Triangle has three straight sides',
            'Rectangle has correct proportions',
            'Corners connect cleanly'
          ]
        }
      }
    ]
  };