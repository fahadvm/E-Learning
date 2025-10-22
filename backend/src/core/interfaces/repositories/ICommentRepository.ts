
import {  IComment } from '../../../models/Comment';

export interface ICommentRepository{
   addComment(comment: IComment) :Promise<IComment>
   getCommentsByCourse(courseId: string) :Promise<IComment[]>
   deleteComment(commentId: string):Promise<IComment | null>  
  
}
