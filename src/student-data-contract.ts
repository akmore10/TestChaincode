/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract} from 'fabric-contract-api';
import { LocationObject } from './locationObject';
import { Student } from './student-model';

export class StudentContract extends Contract {

    public async studentExists(ctx: Context, studentId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(studentId);
        return (!!data && data.length > 0);
    }

    // public name : string;
    // public rollno : number;
    // public marks:number[] ; 
    public async createMyAsset(ctx: Context, studentId: string, name: string,rollno:number,marks :number,locationObj:LocationObject ): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (exists) {
            throw new Error(`The my asset ${studentId} already exists`);
        }
        const studentObj = new Student();
        studentObj.name = name;
        studentObj.rollno = Number(rollno);
        studentObj.marks = [Number(marks)];
        studentObj.locationObj = [locationObj];

        const buffer: Buffer = Buffer.from(JSON.stringify(studentObj));
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

    public async readLocationObject(ctx: Context, studentId: string): Promise<LocationObject[]> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(studentId);
        let student: Student = JSON.parse(data.toString()) as Student;
        
        return student.locationObj as LocationObject[];
    }


    public async insertLocationObject(ctx: Context, studentId: string, locationObj : LocationObject): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        const studentAsBytes = await ctx.stub.getState(studentId);
        const student : Student  = JSON.parse(studentAsBytes.toString()) as Student;
        
        // semMarks = JSON.parse(semMarks.toString());
        // console.log("This is a name from : " + studentId + student.name);
        // student.marks = [...student.marks,...semMarks];
        locationObj = JSON.parse(JSON.stringify(locationObj)) as LocationObject;
        student.locationObj.push(locationObj);

        await ctx.stub.putState(studentId,Buffer.from(JSON.stringify(student)));

        console.log('================ End update the Student ==================')
        
    }


    public async insertMarksArray(ctx: Context, studentId: string, semMarks : number): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        const studentAsBytes = await ctx.stub.getState(studentId);
        const student : Student  = JSON.parse(studentAsBytes.toString()) as Student;
        
        // semMarks = JSON.parse(semMarks.toString());
        // console.log("This is a name from : " + studentId + student.name);
        // student.marks = [...student.marks,...semMarks];

        student.marks.push(Number(semMarks));
        

        await ctx.stub.putState(studentId,Buffer.from(JSON.stringify(student)));

        console.log('================ End update the Student ==================')
        
    }
    public async deleteMyAsset(ctx: Context, studentId: string): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        await ctx.stub.deleteState(studentId);
    }
    

}
