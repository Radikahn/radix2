from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel
from writer import WriteSuggestion


class Mod(BaseModel):
    name: str
    url: str
    image: str


# global instance of db writer
writer = WriteSuggestion()
app = FastAPI(name="SuggestEngine")


@app.post("/mod/suggest")
async def post_suggesstion(mod: Mod):
    writer.insert_suggestion(mod)
    return {"status": "success", "message": "Suggestion added successfully"}


@app.get("/mod/all")
async def get_all_suggestions():
    suggestions = writer.get_all_suggestions()
    return {"suggestions": suggestions}
