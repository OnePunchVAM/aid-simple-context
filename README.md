# AID Simple Context
A simple set of commands to manage three levels of modified context and link world info where necessary.

#### Script Control
* `/debug` toggles debugging mode which outputs modified context to HUD.
* `/show` makes the HUD visible (default).
* `/hide` hides the HUD.
* `/enable` allows script to modify context (default).
* `/disable` disables context modification and hide HUD.

#### Commands: Author's Note
```
/note This is a story set in the World of A Song of Ice and Fire.
/title A Game of Thrones
/author George R. R. Martin.
/genre fantasy
/setting medieval
/theme brutal
/subject conspiracies, lies
/style dark, gritty, detailed
/rating M
```

#### Commands: Character and Scene
```
/you Jon Snow
/at the Winterfell training yard
/with Robb Stark
/time early morning
/desc You and Robb have been training all morning.
```

#### Command: Focus/Override
```
/focus You keep swinging in an attempt to get a hit on Robb.
```

#### HUD Display
By running the above commands you would get a HUD output that looks like this: 
```
Author's Note: This is a story set in the World of A Song of Ice and Fire. Title: A Game of Thrones. Author: George R. R. Martin. Genre: fantasy. Setting: medieval. Theme: brutal. Subject: conspiracies, lies. Writing Style: dark, gritty, detailed. Rating: M.
You are Jon Snow. You are at the Winterfell training yard with Robb Stark. It is early morning. You and Robb have been training all morning.
You keep swinging in an attempt to get a hit on Robb.
```

#### Modified Context

Assuming I had a World Info entry for `Robb Stark` and `Jon Snow`, my modified context would look like the this:

```
Robb Stark:[INSERT_WORLD_ENTRY]
Jon Snow:[INSERT_WORLD_ENTRY]
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
[ Author's Note: This is a story set in the World of A Song of Ice and Fire. Title: A Game of Thrones. Author: George R. R. Martin. Genre: fantasy. Setting: medieval. Theme: brutal. Subject: conspiracies, lies. Writing Style: dark, gritty, detailed. Rating: M.]
[ You are Jon Snow. You are at the Winterfell training yard with Robb Stark. It is early morning. You and Robb have been training all morning.]
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
.. history ..
[ You keep swinging in an attempt to get a hit on Robb.]
.. latest input ..
```

This can all be verified by using the `/debug` special command.