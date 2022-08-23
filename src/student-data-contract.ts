/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract} from 'fabric-contract-api';
import { LegacySandbox } from 'sinon';
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
    public async createMyAsset(ctx: Context, studentId: string, studentObj : Student ): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (exists) {
            throw new Error(`The my asset ${studentId} already exists`);
        }
        let student  : Student = JSON.parse(JSON.stringify(studentObj));
        // let buffer: Buffer = Buffer.from(JSON.stringify(student));
        let buffer: Buffer = Buffer.from(student);
        await ctx.stub.putState(studentId, buffer);
    }





    public async readMyAsset(ctx: Context, studentId: string): Promise<Student> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        // let data: Uint8Array = await ctx.stub.getState(studentId);
        // let student: Student = JSON.parse(data.toString()) as Student;

        let data: Uint8Array = await ctx.stub.getState(studentId);
        let student: Student = JSON.parse(data.toString()) as Student;
        return student;
    }

    public async read(ctx: Context, studentId: string): Promise<Student> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        let data: Uint8Array = await ctx.stub.getState(studentId);
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
        console.log(student);    
        return student.locationObj;
    }


    public async insertLocationObject(ctx: Context, studentId: string, locationObj : LocationObject): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        let student :Student = await this.readMyAsset(ctx,studentId);
        // semMarks = JSON.parse(semMarks.toString());
        // console.log("This is a name from : " + studentId + student.name);
        // student.marks = [...student.marks,...semMarks];
        student.locationObj = [ ...student.locationObj ,JSON.parse(locationObj+"")];
        await ctx.stub.putState(studentId,Buffer.from(JSON.stringify(student)));

        console.log('================ End update the Student ==================')
        
    }



    public async insertMarksArray(ctx: Context, studentId: string, semMarks : number): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        // const studentAsBytes = await ctx.stub.getState(studentId);
        // const student : Student  = JSON.parse(studentAsBytes.toString()) as Student;
        
        const studenObj : Student = await this.readMyAsset(ctx,studentId) as Student;
        // semMarks = JSON.parse(semMarks.toString());
        // console.log("This is a name from : " + studentId + student.name);
        // student.marks = [...student.marks,...semMarks];
        
        console.log(studenObj);
        studenObj.marks.push(Number(semMarks));
        await ctx.stub.putState(studentId,Buffer.from(JSON.stringify(studenObj)));

        console.log('================ End update the Student ==================')
        
    }
    public async udpateInLoactionObject(ctx: Context, studentId: string,locObjId:string, latitude : number): Promise<Student> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);

        }
        let student :Student = await this.readMyAsset(ctx,studentId);
        latitude = Number(latitude);
        // semMarks = JSON.parse(semMarks.toString());
        // console.log("This is a name from : " + studentId + student.name);
        // student.marks = [...student.marks,...semMarks];
        console.log("==================================================");
        console.log("This is inside the updateLocationList");

        student.locationObj = student.locationObj.map((l)=>{
            console.log(l.latitude);
            if(l.id == locObjId){
                l.latitude = latitude;      
            }
            return l;
        });

        console.log("==================================================");
        
        // for(var i = 0 ; i < studentObj.locationObj.length;i++){
        //     if(studentObj.locationObj[i].id == locObjId){
        //         studentObj.locationObj[i].latitude = latitude;
        //     }
        //     console.log(studentObj.locationObj[i]);
        // 
    
        await ctx.stub.putState(studentId,Buffer.from(JSON.stringify(student)));
        return student;
        console.log('================ End update the Student ==================')
        
    }
    public async deleteMyAsset(ctx: Context, studentId: string): Promise<void> {
        const exists: boolean = await this.studentExists(ctx, studentId);
        if (!exists) {
            throw new Error(`The my asset ${studentId} does not exist`);
        }
        await ctx.stub.deleteState(studentId);
    }

    public async getHistory(ctx:Context,studentId:string):Promise<any>{
        const promiseOfIterator = ctx.stub.getHistoryForKey(studentId);

        const results = [];
        for await (const keyMod of promiseOfIterator) {
    
            const resp = {
                timestamp: keyMod.timestamp,
                txid: keyMod.txId,
                data : ""
            }
            if (keyMod.isDelete) {
                resp.data = 'KEY DELETED';
            } else {
                resp.data = keyMod.value.toString();
            }
            results.push(resp);
        }
        return results;
    }
}
