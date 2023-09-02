import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-puzzle-game',
  templateUrl: './puzzle-game.component.html',
  styleUrls: ['./puzzle-game.component.scss']
})

export class PuzzleGameComponent {
  @HostListener('document:keydown', ['$event'])
  keyboardEvent(event: KeyboardEvent) {
    if (!this.isGameWin && this.isGameOver === false) {

      event.code == 'ArrowUp' ? this.handleTop() : event.code == 'ArrowRight' ?  this.handleRight() : event.code == 'ArrowDown' ?  this.handleBottom() : event.code == 'ArrowLeft' ?  this.handleLeft() : ''
    }
  }

  data: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 0, 2, 0, 0]
  ];
  data1: number[][] = [
    [2, 2, 3, 4, 5],
    [2, 7, 2, 9, 10],
    [1233, 2, 232, 14, 15],
    [12, 17, 2, 19, 20],
    [21, 22, 23, 24, 25]
  ];

  boxBackground: backgroundInterface = {
    2: '#92ad00',
    4: '#fd9800',
    8: '#1de9b6',
    16: '#f7eb65',
    32: '#ef6c00',
    64: '#d84315',
    128: '#3cc2e8',
    256: '#dc004e',
    512: '#1976d2',
    1024: '#07ff51',
    2048: '#d77df2'
  };

  isValid: boolean = false
  isCellEmpty: boolean = false
  isGameWin: boolean = false
  isGameOver: boolean = true
  isButtonEnable: boolean = true
  score: number = 0
  isValidToGameOver: boolean = false
  bestScore:number = localStorage.getItem('bestScore') ? JSON.parse(localStorage.getItem('bestScore') as string) : 0;
 
  ngOnInit() {
    this.isGameOver = false
     this.isValid=true
  }

  handleLeft(){
    this.handleLeftAndTop(this.data)
  }
  
  handleRight(){
    this.handleRightAndBottom(this.data)
  }
 
  handleTop(): void { 
    let arr:number[]=[]
    for(let i =0 ; i<this.data.length;i++){
     if(i!=0 && this.data[i].every(res=>res===0)) {
       arr.push(i)
     }
    }
    arr.length!=4? this.transposeArray( 'firstTranspose' , 'top'):''
  }

  handleBottom(): void {
    this.transposeArray( 'firstTranspose' , 'bottom')
  }

  handleLeftAndTop(value: number[][] , from?:string): void {
    this.isValidToGameOver = false
    this.isEmptyCellIsPresent('left')
    if (this.isValid) {
      const newData: number[][] = value.map((arr: number[]) => {
        const temp: number[] = [...arr];
        this.alignValueToLeft(arr, temp)
        return temp;
      });
      this.isValid = false
      this.data = newData
      !this.equalsCheck(value, newData)?this.isValid = true:''
      from==='transpose'?this.toAddAdjacentNumber('left' , 'transpose'):this.toAddAdjacentNumber('left')
    }
  }

  handleRightAndBottom(value: number[][], from?:string): void {
    this.isValidToGameOver = false
    this.isEmptyCellIsPresent('right')
    if (this.isValid) {
      const newData: number[][] = value.map((arr: number[]) => {
        const temp: number[] = [...arr];
        this.alignValueToRight(arr, temp)
        return temp;
      });
      this.isValid = false
      this.data = newData
      !this.equalsCheck(value, newData)?this.isValid = true:'' 
      from==='transpose'?this.toAddAdjacentNumber('right' , 'transpose'):this.toAddAdjacentNumber('right')
    }
  }

  alignValueToLeft(arr: number[], temp: number[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      for (let j = arr.length - 1; j >= 0; j--) {
        if (temp[j] !== 0 && temp[j - 1] === 0 && j > 0) {
          const tempVal = temp[j];
          temp[j] = temp[j - 1];
          temp[j - 1] = tempVal;
        }
      }
    }
  }

  alignValueToRight(arr: number[], temp: number[]) {
    for (let i = arr.length - 1; i >= 0; i--) {
      for (let j = arr.length - 1; j >= 0; j--) {
        if (temp[j] !== 0 && temp[j + 1] === 0 && j < temp.length - 1) {
          const tempVal = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = tempVal;
        }
      }
    }
  }

  equalsCheck = (a: number[][], b: number[][]): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  toAddAdjacentNumber(value: string , from?:string): void {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (this.data[i][j] != 0) {
          if (value && this.data[i][j] === this.data[i][j + 1]) {
            if (value === 'left') {
              this.data[i][j] = this.data[i][j] * 2
              this.score += this.data[i][j]
              this.score > this.bestScore ? this.bestScore = this.score : ''
              this.bestScore = JSON.parse(localStorage.getItem('bestScore')as string)
              this.data[i][j + 1] = 0
            } else if (value === 'right') {
              this.data[i][j + 1] = this.data[i][j] * 2
              this.score += this.data[i][j + 1]
              this.score > this.bestScore ? localStorage.setItem('bestScore' , JSON.stringify(this.score)): ''
              this.bestScore = JSON.parse(localStorage.getItem('bestScore')as string)
              this.data[i][j] = 0
            }
          }
        }
      }
    }
    const newData: number[][] = this.data.map((arr: number[]) => {
      const temp: number[] = [...arr];
      value == 'right' ?  this.alignValueToRight(arr, temp) :this.alignValueToLeft(arr, temp)
      return temp;
    });
    from==='transpose'?this.transposeArray('secondTranspose'):this.data = newData
    this.toFind('gameWin')
    this.isValidtoGenerateRandom()
  }

  isEmptyCellIsPresent(value:string): void {
    let arrayWithoutZero: number[][] = []
    for (let i = 0; i < this.data.length; i++) {
      let eachArray: number[] = [];
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] != 0 ? eachArray.push(j) : ''
      }
      !eachArray.every((res:number) => res === 0) ? arrayWithoutZero.push(eachArray) : ''
      value==='left'?eachArray.length === 1 && eachArray[0] != 0 ? this.isValid = true : '':eachArray.length === 1 && eachArray[eachArray.length-1] === 0 ? this.isValid = true : ''
    }
    for (let i = 0; i < arrayWithoutZero.length; i++) {
      for (let j = 0; j < arrayWithoutZero[i].length; j++) {
        if (arrayWithoutZero[i][j] + 1 !== arrayWithoutZero[i][j + 1]) {
          this.isValid = true
          break;
        }
      }
    }
  }

  generateRandom(): void {
    if (this.isCellEmpty) {
      let x: number = Math.floor(Math.random() * 5)
      let y: number = Math.floor(Math.random() * 5)
      if (this.data[x][y] != 0) {
        this.generateRandom();
      } else {
        this.data[x][y] = 2
        this.isCellEmpty = false
        this.gameOver();
      }
      this.data = this.data
    }
  }

  isValidtoGenerateRandom(): void {
    this.toFind('isEmptyCell')
    if (this.isValid === true && this.isCellEmpty) {
      this.generateRandom()
      this.isValid = false
    }
  }

  transposeArray(transposeOrder:string , direction ?:string): void {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < i; j++) {
        const temp = this.data[i][j];
        this.data[i][j] = this.data[j][i];
        this.data[j][i] = temp;
      };
    }
    if(transposeOrder==='firstTranspose'){
      direction==='top'? this.handleLeftAndTop(this.data , 'transpose'):this.handleRightAndBottom(this.data , 'transpose')
    }
    else{
      this.data = this.data
    }
  }

  toFind(value: string): void {
    outerloop:
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        if (value === 'gameWin') {
          if (this.data[i][j] === 2048) {
            this.isGameWin = true;
            this.isButtonEnable = false
            break outerloop;
          }
        }
        if (value === 'isEmptyCell') {
          if (this.data[i][j] === 0) {
            this.isCellEmpty = true;
            break outerloop;
          }
        }
      }
    }
  }

  newGame(): void {
    this.isGameWin = false
    this.isGameOver = false
    this.data = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [2, 0, 2, 0, 0]
    ];
    this.isButtonEnable = true
    this.score = 0
  }

  gameOver(): void {
    let flatArray: number[] = this.data.flat()
    let notToCheckArray: number[] = [4, 9, 14, 19]
    if (!flatArray.includes(0)) {
      for (let i = 0; i < flatArray.length - 1; i++) {
        if (flatArray[i] === flatArray[i + 5]) {
          this.isGameOver = false
          this.isValidToGameOver = true
          break;
        }
        if (!notToCheckArray.includes(i)) {
          if (flatArray[i] === flatArray[i + 1]) {
            this.isGameOver = false
            this.isValidToGameOver = true
            break;
          }
        }
      }
      if (this.isValidToGameOver === false) {
        this.isGameOver = true
        this.isButtonEnable = false
      }
    }
  }
}

interface backgroundInterface {
  [key: number]: string
}



