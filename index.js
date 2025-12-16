/* 
    Coding standards: https://medium.com/@andriiandriiets/graphql-standards-and-practices-da3246dfb619
*/


const { app, port } = require('./app');

app.listen(port, (error) => {
    if(error){
        console.error(error);
    }

    console.log(`App listening on port ${port}`);
});