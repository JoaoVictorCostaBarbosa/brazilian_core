import uuid
from typing_extensions import Optional

class User:
    def __init__(
        self,
        name: str,
        email: str,
        password: str,
        id: Optional[uuid.UUID] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.name = name
        self.email = email
        self.password = password
