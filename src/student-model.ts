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

// {
//     "id" : 1,
//     "name" : "Akhilesh",
//     "rollNo" : 9091,
//     "marks" : [1,2,3,4],
//     "locationObj" : [
//         {
//             "id" : "1",
//             "latitude" : 10,
//             "longitude" : 10,
//             "address" : "aadsdf",
//         }
//     ]
// }