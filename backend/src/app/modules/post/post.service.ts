import { Post } from "./post.model"

//add blood request posts
const addBloodRquestPost = async (formData: any) => {
    const result = await Post.create(formData);
    return result;
}

export const postServices = {
    addBloodRquestPost,
}