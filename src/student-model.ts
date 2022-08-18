/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { LocationObject } from './locationObject';

export class Student {
    public name : string;
    public rollno : number;
    public marks:number[] ; 
    public locationObj : LocationObject[];   

    
}