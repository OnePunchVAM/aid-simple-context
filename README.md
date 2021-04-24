# Simple Context 2 - BETA
<img src="https://media.discordapp.net/attachments/717764081058185316/835015926440919070/unknown.png" alt="Simple Context 2 in action">

## Main Features
- [x] **Keep the AI on track of your story automatically**

- [x] **Create, edit, and format world info entries all without leaving the input field**

- [x] **Define relationships, change scenes, build factions or entire worlds**

- [x] **Track which and where entries show up in the context**

- [x] **Easily place notes or entry data *anywhere* in the context**

- [x] **Compatible with any popular format and optionally converts entries on injection**

- [x] **Customize everything from the user interface to scene breaks and paragraph spacing**

- [x] **Designed from the ground up to be flexible and user-friendly**

- [x] **Custom titles, automatic pronoun matching, character point of view swapping, and much more!**

<br />

More info at the official discord [here](https://discord.com/channels/653773513857171475/717764081058185316/828113500827811890).

Want to jump right in?
<br />You can play a Harry Potter themed example world info with everything already setup [here](https://discord.com/channels/653773513857171475/717764081058185316/833599529554018364).

<br />

## Usage

### Input Commands
###### Script and Menu Control
Commands for tweaking functionality of the script itself and its graphical display.
* `/config` toggles display of the configuration menu (enable/disable signposts, paragraph spacing etc).
* `/debug` toggles debugging mode which outputs modified context to a menu above the input field.
* `/enable` allows script to modify context (default).
* `/disable` disables context modification and hides the menus.
* `/show` makes the menus visible (default).
* `/hide` hides the menus.
* `/min` minimizes the menus.
* `/max` maximizes the menus.

###### Menu Navigation
Commands for moving through the graphical display menus.
* `!` exits any menu. If changes were made, a `y/n` prompt will appear to confirm saving of changes made.
* `>` and `<` moves the current selection forward (down) or back (up) the list of menu options.
* `>>` and `<<` moves the current selection to the next or previous menu page.
* `#0` will move the current selection to the label option, or first (top) of the list of menu options.
<br />Entering any number except 0 will move the current selection to the nth option in the list counting from the top.

###### Context Definition
Commands for creating and tweaking of context-related content, with examples. Each has a graphical menu to guide you through the process.
* `/e` or `/entry John` creates or loads the world info [entry](#entries) with the label "John".
* `/r` or `/rel John` opens the [relationship](#relationships) menu for "John".
* `/t` or `/title ex wife` creates or loads the [title](#titles) with the label "ex wife".
* `/f` or `/find Mary` searches and displays all [scenes](#scenes), [entries](#entries) and [titles](#titles) with the label "Mary".
* `/b` or `/ban John, Mary` prevents the entries "John" and "Mary" from being injected into context.
* `/b` or `/ban` with no entries specified will clear all previous bans.
* `/k` or `/kill John` updates [entry](#entries) "John" and sets their status to dead.
* `/revive Mary` updates [entry](#entries) "Mary" and sets their status to alive.

###### Scene and Perspective
Commands for loading different scenes and switching control over the player character, with examples.
* `/y` or `/you John` switches the user POV and control to the character "John" (only use with 2nd person perspective).
* `/s` or `/scene Chapter 1` opens the [scene](#scenes) creation/editing menu for the scene with the label "Chapter 1".
* `/l` or `/load Chapter 1` loads the [scene](#scenes) and executes any text to prompt as per configuration in the scene menu.
* `/n` or `/notes` will display all currently active [custom notes](#custom-notes) (see next).
* `+💭#500: You think this will be an easy victory` creates/updates a [custom note](#custom-notes) labeled `💭` and injected before 500 characters into the context.

###### Advanced Usage
Commands tailored towards power users, with examples.
* `/flush` will clear state.displayStats in the rare case that it bugs out.
* `@`, `#`, `$`, `%`, or `^` are [quick entry creation](#quick-entry-access) symbols that correspond with each entry type. Left to right, they are `Character`, `Location`, `Thing`, `Faction`, and `Other`.
  * `#Hogwarts: is a school for wizards: is a large castle: is a place of great mystery` creates the location entry with the label "Hogwarts" and fills in each of the entry's fields with the corresponding information, separated by `:`s.
  * `#Hogwarts+2:  with tall gothic spires` appends the included information to the second field of the entry labeled "Hogwarts" such that it now reads `is a large castle with tall gothic spires`.
  * `@convert!: John Smith, Jane Smith, Mary` will add all vanilla WIs with the keys "John Smith", "Jane Smith", and "Mary" as SC2 character entries.

<br />

### Details
#### Navigation of the User Interface
Simple Context 2 features an emoji-based menu for ease of use.
```
➰ : King John ∙∙ Character (1/3)
🔍 : /King John/g
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
   📑 : King John is a terrible and cruel ruler who XYZ.
   👁️ : King John is wearing XYZ.
   🔉 : King John never likes to XYZ.
🔅 💬 : ❔
```
<sub>An example of a SC2 menu</sub>

Navigation of SC2's menus is done through [quick input commands](#menu-navigation).

The 🔅 emoji marks the current selection in the menu. Simply type `>` to move the current selection to the next field or `>>` to move to the next page.

```
🔅 📑 : ❔
   👁️ : ❔
   🔉 : ❔
   💬 : ❔
```
<sub>Entry menu with MAIN selected</sub>

...from here, inputing `>` results in...

```
   📑 : ❔
🔅 👁️ : ❔
   🔉 : ❔
   💬 : ❔
```
<sub>Entry menu with SEEN selected</sub>

At the top of the menu is the Label field, which refers to the subject of this menu. The entry and title menus also have a field for Keys, which functions exactly as it does in vanilla world info entires with the exception that regex is also accepted.

```
🔱 : Snape ∙∙ New Character
🔍 : /Snape/g
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
```
<sub>The top of the menu, showing Label and Keys fields for a new entry</sub>

Typing `#` and a number will select that numbered option in the list starting from 0 at the top. The exception is the Keys field in Entry and Title menus, which can only be navigated to by inputting `#0` to select the label and then `>` to selet Keys.

If the menu has multiple pages, they will be shown next to the label in parentheses:

```
🔱 : Snape ∙∙ Character (1/3)
```
<sub>First page of a menu</sub>

...from here, inputting `>>` results in...

```
🔱 : Snape ∙∙ Relations (2/3)
```
<sub>Second page of a menu</sub>

Typing `!` when in a menu will exit the menu. A y/n (yes / no) prompt for saving any changes made in the menu will appear just above the input field.

```
✔️ Do you want to save these changes? (y/n)
```
<sub>A prompt above the input bar for save confirmation of changes made</sub>

You can also skip this confirmation prompt by instead typing `y!` or `n!` to exit the menu with saved or discarded changes respectively.

<br />

#### Entries
Entries are effectively the nouns of your story (people, places, things, etc). "Entry" is short for World Info Entry as in the optional data that AI Dungeon uses to flesh out scenarios.

<img src="https://user-images.githubusercontent.com/1778722/115824521-e5d43180-a3bc-11eb-9796-04143a30fc3e.png" alt="A vanilla AID world info entry">

World info entries (or WIs for short) are incredibly useful and when used well can greatly enhance the AI's storytelling ability. However, writing them is cumbersome and tweaking them to function most effectively even more so. That's where Simple Context 2 comes in.

Creating entries in SC2 is as easy as typing
```
/entry Snape
```
From there, all you need to do is choose what type of entry this will be (for example, type `character`)

```
🎭🗺️📦👑💡  Enter the CATEGORY for this entry: (c/l/t/f/o)
```
<sub>A prompt above the input bar for selecting the category type for a newly created entry</sub>

and a [graphical interface](#navigation-of-the-user-interface) where you can input more details will appear at the top right of the screen.

```
🔱 : Snape ∙∙ New Character
🔍 : /Snape/g
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
🔅 📑 : ❔
   👁️ : ❔
   🔉 : ❔
   💬 : ❔
```
<sub>The Entry creation menu</sub>

Each emoji represents a different field where you can add details about the entry. The most common fields are `MAIN`, `SEEN`, `HEARD`, and `TOPIC`. Note that not all entry types have all of these fields.
<br />Let's go over each of these:
* `📑 MAIN` describes the absolute basics of your entry. If it is a character, it might include gender, race, height, etc. This always appears alongside any mention of the entry's label. Comparible to the Zaltys format `DESC` category.
* `👁️ SEEN` captures the appearance of your entry: A character's eyes or hair, a location's hills or structures, etc. This triggers when an entry has been seen by a character or when its visual features have been noted in the story. Comparible to the Zaltys format `APPEAR` category.
* `🔉 HEARD` involves how an entry sounds but also how it acts. This is triggered when an entry has made a sound or spoken a line and is comparible to the Zaltys format `MIND` category.
* `💬 TOPIC` is for any other details that either don't fit in the previous fields or are too broad to single out into just one, such as history or favorite food. Triggered when an entry has been referenced and is comparible to the Zaltys format `SUMMARY` category.




##### Character




##### Location


##### Thing


##### Faction


##### Other


<br />

#### Relationships

Relations is the second page of the [Entry](#entries) menu and refers to the various relationships the given entry has with other entries.

```
🧟: Voldemort ∙∙ Relations (2/3)
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
✔️ : ➰ Harry [🤬🥊👎] ∙∙ 👑 Death Eaters [🤩💍👍]
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
   👋 : Harry:1E-
   🧬 : ❔
   🧸 : ❔
   💰 : Death Eaters:5M+
   🙏 : ❔
```
<sub>Voldemort's Relations menu</sub>

Just beneath the Label and first set of wavy lines is a list of the entry's different relationships that SC2 recognizes. Each one has a set of emojis which, when read together, represent the nature of that relationship at a glance.

For example we can see above that Voldemort hates Harry and considers him an enemy:

```
➰ Harry [🤬🥊👎]
```
<sub>Voldemort's relationship to Harry</sub>

as well as that Voldemort is the leader of the Death Eaters faction which he very much likes:

```
👑 Death Eaters [🤩💍👍]
```
<sub>Voldemort's relationship to the Death Eaters</sub>

Check out [the Relationship Mapping section](#relationship-mapping) below for more information on interpreting these specific emojis.

Moving further down past the second set of wavy lines, we see a few different fields. These fields are the data that SC2 reads in order to interpret the relationships that were outlined above.

One at a time, they are:
```
👋 CONTACTS : The entries that are known to this one
🧬 PARENTS : This entry's parents
🧸 CHILDREN : This entry's children
💰 PROPERTY : The entries that are owned by this one
🙏 OWNERS : The entries that own this one
```
<sub>The Relations menu fields</sub>

Any numbers or letters following a `:` next to any entries in a field represent [relationship mapping](#relationship-mapping) details for that entry.

###### Relationship Mapping
```
DISPOSITIONS
🤬 1 : Hate
😒 2 : Dislike
😐 3 : Neutral
😀 4 : Like
🤩 5 : Adore

MODIFIERS
👍 + : More
👎 - : Less
💥 x : Ex

TYPES
🤝 F : Friends/Extended Family
💞 L : Lovers
✊ A : Allies
💍 M : Married/Member of Faction
👎 E : Enemies

FORMAT
[1-5][FLAME][-+x]

EXAMPLES
Jill:1
Jack:4F
Mary:2Lx, John:3A+
```
<sub>A list of the various emojis used in the FLAME relationship mapping system</sub>

Most of the emojis in the relationship mapping chart above are self-explanatory except for the `MODIFIERS` which tend to cause a bit of confusion. In short, `MODIFIERS` are *relative* symbols that can be used to enhance or decrease the value of a given `TYPE`.

For example, `M` in relation to a `Faction` would normally mean "Member" of that faction, however `M+` would mean "Leader or high-ranking member" of that faction, whereas `M-` might mean temporary member or intern. The `x` modifier means "used to be `TYPE` but is no longer", such as with a divorced spouse (`Mx`) or enemy turned ally (`Ex`).

However, it is important to remember that the `MODIFIERS` are *relative* to how the other types are being used, meaning `M` could just as easily be represented as "Co-Leader" of a faction if `M-` are how normal members are represented. It all depends on how the [Titles](#titles) being used are defined.

Furthermore, much of this system can be completely customized, especially the FLAME `TYPES`. Check out the Configuration section of the SC2 script to see how.

<br />

#### Titles
Titles are one of the most powerful features of SC2, but are also one of the most complex.

A title represents how one entry perceives another. This can mean anything from familial relationships such as Sister or Uncle to official titles like High King to even personal feelings like My Idiot Neighbor.

To create a title, simply type `/title` followed by a name for your new title into the input field.

```
🏷️ : You-Know-Who ∙∙ New Title ∙∙ Target Entry (1/2)
🔍 : /You-Know-Who|He Who Must Not Be Named/g
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
🔅 🎭 : ❔
   🤩 : ❔
   🥊 : ❔
   💥 : ❔
   💀 : ❔
   🔱 : ❔
   📌 : ❔
   🧑‍🤝‍🧑 : ❔
```
<sub>The Title creation menu</sub>

It may look a little intimidating a first, but once you grasp the basics it becomes quite easy to create and use titles.

To get the most out of titles, you must first understand three important things:
1. [Who the `Target` and `Source` pages refer to](#target-and-source)
2. [How titles are applied to an entry (ie. automatically)](#how-titles-are-applied)
3. [What a title's fields represent both individually and together](#the-title-fields)

###### Target and Source
Let's start by taking a look at the top of each page of the title menu:

```
🏷️ : You-Know-Who ∙∙ Target Entry (1/2)
```
<sub>The top of the title menu, showing the Target of the title</sub>
```
🏷️ : You-Know-Who ∙∙ Source Entry (2/2)
```
<sub>The top of the title menu, showing the Source of the title</sub>

As with most of SC2's menus, the top shows the Label and an indication of which page of the menu is currently displayed. The first page is for the `Target` of the title and the second is for its `Source`.

The `Target` of a title is any entry this title will apply to. For our example of You-Know-Who / He Who Must Not Be Named, it's Voldemort.

The `Source` of a title is any entry that perceives the target in the way that the title represents. In our example that's every witch and wizard except Harry and Dumbledore (who see him simply as Tom Riddle) or anyone in the Death Eaters faction (who see him as The Dark Lord).

Another way to look at the distinction between a title's target and source is to consider two people in a room:
<br />Imagine yourself from the perspective of one of those people (the `Source`) looking at the other person (the `Target`) and say: "How do *I* consider *you*? Who *are* you to me? What do I *call* you?"

When you think of it this way, a title is just a one-way perspective with a name.

###### How Titles are Applied
Keep in mind that a title is applied to an entry *automatically* based on [how a title's fields are defined](#the-title-fields). That said, there is still a bit of setup that needs to be done first in order for a title to actually be applied to entries. 

Since titles involve the relationships between entries, it is important that a given entry's relations page is filled out accurately as this is the data SC2 uses to automatically apply titles to entries.

```
🧟: Voldemort ∙∙ Relations (2/3)
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
✔️ : ➰ Harry [🤬🥊👎] ∙∙ 👑 Death Eaters [🤩💍👍]
〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
🔅 👋 : Harry:1E-
   🧬 : ❔
   🧸 : ❔
   💰 : Death Eaters:5M+
   🙏 : ❔
```
<sub>Voldemort's Relations menu page</sub>

A title's fields function as a list of conditions, all of which must match with an entry's `Relations` data in order for it to be applied to that entry. This goes for both `Target` and `Source` pages.

It is important to only fill out the *minimum necessary* fields in each page of a title: broad enough to match the intended entries without needing to change them just for the title, but also specific enough to *only* match the intended entries.



###### The Title Fields



...

<br />

#### Scenes

...

##### Changing Perspective

for example in the above screenshot, if I used /you Snape it would change all the entries to:
```
📑 : You are a dour man.
👁️ : You have greasy hair and a hooked nose.
🔉 : You talks about the dark arts.
💬 : You were a follower of the Dark Lord.
```

...

##### Loading Scenes
...
Note that `/l!` or `/load! Chapter 1` with that exclaimation point loads the [scene](#scenes) WITHOUT executing any text to prompt.

...

Multiple scenes can be loaded at once, combining their effects
```
/load Intro Scene, Cloudy Weather, Jack's POV, badly hurt, fluff prompt
```
All notes get accumulated and overwritten in order of scene load.  The SCENE BREAK text only appears for the very first scene loaded.
Of course you can bypass prompt like usual.
```
/load! healthy, sunny weather
```

...

##### Custom Notes
This command is a catchall that allows you to not only set as many notes to inject into context as you want, but it also allows you to specify WHERE you inject the note. Syntax is as follows:
```
+LABEL#POSITION:TEXT
```

Where:
 * `LABEL` is the unique label to give the note (ie, `think` or `🧠`).
 * `POSITION` is the distance back from the user input (front of context) the note should be injected and is measured in total characters (rounded to whole sentences).
 * `TEXT` is the actual text to inject into context itself.

Examples:
```
+🧠:100:This is my focus text
+think:This is my think text
+☁ Cloudy:600:This is some weather text 
+🎬 Chapter 1:This is some scene text
```

Editing the position of an existing note is easy. Simply call the command again with a different POSITION:
```
+🧠:234
+🎬 Chapter 1:675
```

Same with changing the content of a note:
```
+🧠:This is my NEW focus text
```

Removing a note is quick and easy:
```
+🧠
+think
+🎬 Chapter 1
```

You can hoist the injected note to the very top of the context.
```
+🧠#-1:This will be at the top.
+☁ Cloudy#-20:This will be above the -1 entry (the very very top).
```

Or automatically append a prefixed label to it
```
++Weather:This note will begin with Weather as a prefix
```

You can set as many notes on a scene as you want. Open the scene with /s My Scene and navigate to Page 2. From here you can enter notes as you normally would from outside the menus.

Hiding notes is also possible. Add a note that is hidden by default:
```
+my_note#500!: This is my test note
+my_other_note!:Some note text.
```

To hide a visible note:
```
+my_note!
```

To show a hidden note:
```
+my_note!
```

<br />

#### Quick Entry Access
(in progress...)
`@`, `#`, `$`, `%`, or `^` are quick entry creation symbols.
<br />Each symbol corresponds with an entry type. Left to right, they are `Character`, `Location`, `Thing`, `Faction`, and `Other`.
* When placed left of a label, they allow for quick entry creation. Fields are separated by `:`.
<br />For example, `$Hogwarts Castle: is a school for wizards: has tall gothic spires: is a place of great mystery`
or `@Snape: is a dour man: has greasy hair and a hooked nose: talks about the dark arts: was a follower of the Dark Lord`.
* When placed left of label along with a plus or equals symbol, they allow for quick appending/overwriting of individual fields on an existing entry. Examples:
<br />`@Harry+1: this is appended to the MAIN entry`
<br />`@Harry+main: same thing as ^`
<br />`@Harry=3: this will overwrite the contents of the HEARD entry`
<br />`@Harry=heard: same thing as ^`
<br />`$Stargate=1: Stargate is a device used to travel to other planets`
* When placed left of the `convert` keyword and an exclaimation point, they convert existing vanilla world info entries in bulk.
<br />For example, `@convert!: John Smith, Jane Smith, Mary` will add all vanilla WIs with those keys as SC2 character entries.
If used *without* an exclaimation point, it will do a dry run without converting anything instead returning what *would* have been converted.
If used with two exclaimation points, it will *overwrite* the existing entries.
<br />It also works great with regex. For example: `#convert!!: /.*Town/gi`


<br />

#### Configuration



