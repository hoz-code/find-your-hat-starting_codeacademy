const prompt = require('prompt-sync')({ sigint: true });

class Field {
    constructor(heigth, width) {
        this.field_game = Field.generateField(heigth, width);
    }
    
    static rawBoard = {
        rawBoard: ''
    }

    static catalogueOfTiles = {
        hat : '^',
        hole : 'O',
        fieldCharacter : '░',
        pathCharacter : '*'
    }

    static generateBlankBoard(heigth, width) {
        let blankField = [];
        let j = 0;
        for (let i = 0; i < heigth; i++) {
            blankField.push([]);
            for (j = 0; j < width; j++) {
                blankField[i].push(Field.rawBoard.rawBoard); /***************** */
            }
            j = 0;
        }
        return blankField;
    }



    static findCoordinateElemen (element_game, board_game) {
        for(let i = 0; i < board_game.length; i++){
            for(let j = 0; j < board_game[i].length; j++){
                if (board_game[i][j] === element_game){
                    return [i,j]
                }
            }
        }
        return `The Element ${element_game} not was found`
    }




    static generateField(heigth, width) {
        let dificultHole = 0.2;

        let blankBorad = Field.generateBlankBoard(heigth, width)

        const randomPositionInRow = (width) => {
            let randomPositionInRow = Math.floor((Math.random() * width));
            return randomPositionInRow;
        }

        const setPathCharacterAndHatInBoard = (blankBorad) => {
            let boarWithPathCharacterAndHat = blankBorad
            let randomPositionInRows = randomPositionInRow(blankBorad[0].length)
            boarWithPathCharacterAndHat[0][randomPositionInRows] = Field.catalogueOfTiles.pathCharacter
            randomPositionInRows = randomPositionInRow(blankBorad[blankBorad.length - 1].length)
            boarWithPathCharacterAndHat[blankBorad.length - 1][randomPositionInRows] = Field.catalogueOfTiles.hat
            return boarWithPathCharacterAndHat
        }


        const setHoleCharacterInBoard = () => {
            let setHoleCharacterInBoard = setPathCharacterAndHatInBoard(blankBorad)

            let coordinatePathChar = Field.findCoordinateElemen(Field.catalogueOfTiles.pathCharacter, setHoleCharacterInBoard)
            let coordinateHat = Field.findCoordinateElemen(Field.catalogueOfTiles.hat, setHoleCharacterInBoard)

            const coordinatesToLoked = (coordinatePathChar, coordinateHat) => {  
                let coodinatesLoked = []
                let height = setHoleCharacterInBoard.length
                let width = setHoleCharacterInBoard[0].length

                coodinatesLoked.push(coordinatePathChar)
                if (coordinatePathChar[0] === 0 && coordinatePathChar[1] === 0){ 
                    coodinatesLoked.push([1,0])
                    coodinatesLoked.push([0,1])
                }
                if (coordinatePathChar[0] === 0 && coordinatePathChar[1] === width - 1){ 
                    coodinatesLoked.push([1, width - 1])
                    coodinatesLoked.push([0, width - 2])
                }

                coodinatesLoked.push(coordinateHat)
                if (coordinateHat[0] === height - 1 && coordinateHat[1] === 0){ 
                    coodinatesLoked.push([height - 2,0])
                    coodinatesLoked.push([height - 1,1])
                }
                if (coordinateHat[0] === height - 1 && coordinateHat[1] === width - 1){
                    coodinatesLoked.push([height - 2, width - 1])
                    coodinatesLoked.push([height - 1, width - 2])
                    
                }
                return coodinatesLoked
            }  

            const coordinatesLoked = coordinatesToLoked(coordinatePathChar, coordinateHat)

            const availableCoordinatestoHole = (coordinatesLoked, board_game) => {
                let findLokedCoor;
                let availableCoordtoHole = []
                for (let i = 0; i < board_game.length; i++) {
                    for (let j = 0; j < board_game[i].length; j++) {
                        findLokedCoor = coordinatesLoked.some(item => {
                            return (item[0] === i && item[1] === j)
                        })
                        if(!findLokedCoor){
                            availableCoordtoHole.push([i,j])
                        }
                    }
                }
                return availableCoordtoHole
            };   

            let availableCoordtoHole = availableCoordinatestoHole(coordinatesLoked, setHoleCharacterInBoard)

            const setHolesInAvailableCoord = (availableCoordtoHole, boardGameFillWithHoles) => {
                let amountHolesAvailables = Math.round(availableCoordtoHole.length * dificultHole)
                while(amountHolesAvailables > 0){
                    let randomAvailableCoord = Math.floor((Math.random() * availableCoordtoHole.length));
                    let coordenateX = availableCoordtoHole[randomAvailableCoord][0]
                    let coordenateY = availableCoordtoHole[randomAvailableCoord][1]
                    boardGameFillWithHoles[coordenateX][coordenateY] = Field.catalogueOfTiles.hole
                    availableCoordtoHole.splice(randomAvailableCoord,1)
                    amountHolesAvailables--
                }
                return boardGameFillWithHoles
            }
            let boardWithHoles = setHolesInAvailableCoord(availableCoordtoHole, setHoleCharacterInBoard)
            return boardWithHoles
        }

        let boardWithHoles = setHoleCharacterInBoard()

        const setFieldInBoard = (boardGameComplete) =>{
            for(let i = 0; i < boardGameComplete.length; i++){
                for(let j = 0; j < boardGameComplete[i].length; j++){
                    if(boardGameComplete[i][j] === Field.rawBoard.rawBoard){   /*************************** */
                        boardGameComplete[i][j] = Field.catalogueOfTiles.fieldCharacter
                    }
                }
            }
            return boardGameComplete
        }

        let boardComplete = setFieldInBoard(boardWithHoles)
        return boardComplete;
    }

    print() {
        for (const element of this.field_game) {
            console.log(element.join(Field.rawBoard.rawBoard)); ////////////////////////////////////////////////
        }
    }
}

/*************************************************** */




// r = right
// l = left
// u = up
// d = down


const star_game = () =>{
    const field_one = new Field(5, 5);
    let flag = true

    const findCoorHole = (elementSought, boardGame) => {
        let coorHoles = []
        for(let i =0; i<boardGame.length; i++){
            for(let j = 0; j<boardGame[i].length;j++){
                if(boardGame[i][j] === elementSought){
                    coorHoles.push([i,j])
                }
            }
        }
        return coorHoles
    }

    let lastCoorVertical = field_one.field_game.length - 1
    let lastCoorHorizontal = field_one.field_game[0].length - 1

    let coorPathChar = Field.findCoordinateElemen(Field.catalogueOfTiles.pathCharacter, field_one.field_game)
    let coorHat = Field.findCoordinateElemen(Field.catalogueOfTiles.hat,field_one.field_game)
    let coorHole = findCoorHole(Field.catalogueOfTiles.hole, field_one.field_game)

    const foundHole = (coorHole, coorPathChar) =>{
        let foundHoled = coorHole.some(hole=>{return hole[0] === coorPathChar[0] && hole[1] === coorPathChar[1]})
        return foundHoled
    }

    const foundHats = (coorHat, coorPathChar) =>{
        let foundHat = coorHat[0] === coorPathChar[0] && coorHat[1] === coorPathChar[1]
        return foundHat
    }

    const leaveMarkInBoard = (board, coordenate, character) =>{
        board[coordenate[0]][coordenate[1]] = character
    }
    
    const messages = {
        limit : `Exceeded the limit!!!!! Try again!`,
    }
    
    const holeFound = () =>{
        console.log('YOU FOUND A HOLE YOU LOOSE!!!!!!!!')
        flag = false
    }
    const hatFound = () =>{
        console.log('YOU FOUND A HAT YOU WIN!!!!!!!!')
        flag = false
    }
    while(flag){
        field_one.print();
        console.log('Press the moviment:....');
        console.log('r = right, l = left, u = up, d = down ...   ')
        let input_data = prompt('Wich direction do you want? : ');
        switch(input_data){
            case 'r':
                coorPathChar[1] = coorPathChar[1] + 1 
                if(coorPathChar[1] > lastCoorHorizontal){
                    console.log(messages.limit)
                    coorPathChar[1] = coorPathChar[1] - 1 
                }else{
                    let foundHoled = foundHole(coorHole, coorPathChar)
                    let foundHat = foundHats(coorHat, coorPathChar)
                    if(foundHoled){
                        holeFound()
                    }else if(foundHat){
                        hatFound()
                    }else{
                        leaveMarkInBoard(field_one.field_game, coorPathChar, Field.catalogueOfTiles.pathCharacter)
                    }
                }
                break;
            case 'l':
                coorPathChar[1] = coorPathChar[1] - 1
                if(coorPathChar[1] < 0){
                    console.log(messages.limit)
                    coorPathChar[1] = coorPathChar[1] + 1 
                }else{
                    let foundHoled = foundHole(coorHole, coorPathChar)
                    let foundHat = foundHats(coorHat, coorPathChar)
                    if(foundHoled){
                        holeFound()
                    }else if(foundHat){
                        hatFound()
                    }else{
                        leaveMarkInBoard(field_one.field_game, coorPathChar, Field.catalogueOfTiles.pathCharacter)
                    }
                }
                break;
            case 'u':
                coorPathChar[0] = coorPathChar[0] - 1
                if(coorPathChar[0] < 0){
                    console.log(messages.limit)
                    coorPathChar[0] = coorPathChar[0] + 1 
                }else{
                    let foundHoled = foundHole(coorHole, coorPathChar)
                    let foundHat = foundHats(coorHat, coorPathChar)
                    if(foundHoled){
                        holeFound()
                    }else if(foundHat){
                        hatFound()
                    }else{
                        leaveMarkInBoard(field_one.field_game, coorPathChar, Field.catalogueOfTiles.pathCharacter)
                    }
                }
                break;
            case 'd':
                coorPathChar[0] = coorPathChar[0] + 1
                if(coorPathChar[0] > lastCoorVertical){
                    console.log(messages.limit)
                    coorPathChar[0] = coorPathChar[0] - 1 
                }else{
                    let foundHoled = foundHole(coorHole, coorPathChar)
                    let foundHat = foundHats(coorHat, coorPathChar)
                    if(foundHoled){
                        holeFound()
                    }else if(foundHat){
                        hatFound()
                    }else{
                        leaveMarkInBoard(field_one.field_game, coorPathChar, Field.catalogueOfTiles.pathCharacter)
                    }
                }
                break;
            default:
                console.log('WRONG COMMAND!!!... PLEASE PRESS: r = right, l = left, u = up, d = down')
                break;
        }
    }

}




star_game()








