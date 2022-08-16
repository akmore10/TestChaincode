/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract} from 'fabric-contract-api';
import { Student } from './student-model';

export class StudentContract extends Contract {

    public async studentExists(ctx: Context, studentId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(studentId);
        return (!!data && data.length > 0);
    }


    public async createMyAsset(ctx: Context, studentId: string, studentObject:Student): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (exists) {
            throw new Error(`The my asset ${studentId} already exists`);
        }
        const buffer: Buffer = Buffer.from(JSON.stringify(studentObject));
        await ctx.stub.putState(studentId, buffer);
    }





    public async readMyAsset(ctx: Context, studentId: string): Promise<Student> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(studentId);
        let student: Student = JSON.parse(data.toString());
        return student;
    }


    public async insertMarksArray(ctx: Context, studentId: string, semMarks : number[]): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        // getting data from ledger
        const data: Uint8Array = await ctx.stub.getState(studentId);
        let studentObject : Student = JSON.parse(data.toString());

        let newStudentObject :Student = new Student(studentObject.name,studentObject.rollno,studentObject.marks);
        // updating the marks array 
        newStudentObject.marks = [...newStudentObject.marks,...semMarks];
        
        
        // putting back the updated object to ledger
        const buffer: Buffer = Buffer.from(JSON.stringify(newStudentObject));
        await ctx.stub.putState(studentId, buffer);
        
    }

    public async deleteMyAsset(ctx: Context, studentId: string): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        await ctx.stub.deleteState(studentId);
    }
    public async parseItems(name : string,rollno : number,marks : number[]) : Promise<Student>{
        return new Student(name,rollno,marks);
    }

}
