from langchain_core.messages import (
    HumanMessage,AIMessage,SystemMessage
)

from model.ChatModel import model

from rag.retriever import get_blog_retriever

def create_retrival_query(history, current_message):
    messages = [
        SystemMessage(
            content = """
            You are a search query generator for a blog chatbot.

Convert the user's latest message into a standalone search
query that can be used to retrieve relevant information
from the current blog.

Use the conversation history to understand references such as:
- it
- this
- that
- they
- the above
- the previous point
- the second point

Do NOT answer the question.

Return ONLY the standalone search query.
            """
            
        )
    ]
    
    #adding history
    for item in history:
        if item.role == "user":
            messages.append(
                HumanMessage(content = item.content)
            )
        elif item.role == "assistant":
            messages.append(
                AIMessage(content=item.content)
            )
            
            
    messages.append(
            HumanMessage(
                content= current_message
            )
        )
    response = model.invoke(messages)
    return response.content.strip()
               
async def chat_with_blog(
    blog_id,
    message,
    history
):
    # create search query
    retrieval_query = create_retrival_query(
        history,
        message
    )
    # print("this is the history received:\n", history)
    # print("this is retrieved query ", retrieval_query)
    # retrieve from blog 
    
    retriever = get_blog_retriever(blog_id)
    documents = retriever.invoke(retrieval_query)
    
    #create context
    
    context = "\n\n".join(
        document.page_content for document in documents
    )
    
    messages = [
        SystemMessage(
            content = f"""
            You are a chatbot for the current blog.

You must answer ONLY using information from the
provided blog context.

Rules:

- Answer questions related to the current blog.
- Use conversation history to understand follow-up questions.
- The conversation history is the authoritative source for references to
  earlier messages. Before answering, inspect it and resolve phrases such as
  "these two tasks", "that", "it", "the above", and "the second one".
- Never say that an earlier item was not mentioned when it appears in the
  conversation history supplied below.
- Example: if an earlier user message says "is Cursor better with front-end
  tasks or back-end tasks?" and the current user asks "when I say these two
  tasks, you understand what I mean, right?", "these two tasks" means
  front-end tasks and back-end tasks. Acknowledge that connection directly.
- Conversation-memory questions are allowed. For questions such as
  "what was my last message?", quote the most recent earlier user message
  from the conversation history. For "your last message", quote the most
  recent earlier assistant message. For "second last", use the second most
  recent message of the requested role.
- Do not repeat the current question as the answer to a conversation-memory
  question. The current question is not part of the earlier conversation.
- Example: if the earlier conversation is:
  User: "hi"
  Assistant: "Your first message was: hi"
  User: "what was my first message?"
  and the current question is "what was my last message?", the correct
  answer is: "Your last message was: what was my first message?"
  The current question must never be counted as the user's last message.
- Use a little bit outside knowledge only till extent that is relevant to the blog you are discussing.
- Do not answer unrelated questions.
- If a blog-related answer is not available in the blog context,
  say that it is not available in this blog.
- You may summarize, explain, clarify, compare ideas,
  and discuss the blog.
- Do not invent information.
- Maintain a strict text generation word limit, at max 220
Blog context:

{context}"""
            
        )
    ]
    
    
    for item in history:
        if item.role == "user":
            messages.append(HumanMessage(content=item.content))
        elif item.role == "assistant":
            messages.append(AIMessage(content=item.content))

    
    messages.append(
        HumanMessage(
            content = message
        )
    )
    
    res = model.invoke(messages)
    print("this was the content recieved: \n", res.content)
    return res.content

                   
