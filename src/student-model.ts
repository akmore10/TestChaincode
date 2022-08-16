/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

export class Student {

    constructor(name : string,rollno : number,marks : number[]){
        this.name = name;
        this.rollno = rollno;
        this.marks = marks;
    }
    public name : string;
    public rollno : number;
    public marks:number[] ;    

    
}