#Mad-Blurbs

##Contents:
 - [What it is](#what-it-is)
 - [How to use it](#how-to-use-it)
 - [How it works](#how-it-works)
 - [Credits](#credits)

##What it is

Mad-Blurbs is a small experiment in auto-generated but grammatically-correct sentences. It's basically Mad-libs, but the computer fills in the blanks for you.

##How to use it

There are three categories of elements you can add. 

- The first (and most complicated) is Words. Here, you pick a general category, and then the specific subtype. For example, let's say you want a sentence identical to the following, grammatically: `The dog barks`. You'd pick Verb, and then 3rd sg. Present for the verb type.

- The second is Fragments. These are basically equivalent to the words between the blanks in regular Mad-libs. To use the example from above, let's say you want to make sure your sentence always starts with the word "the". You'd write 'the' as a fragment.

- The final category is Punctuation. Pretty self-explanatory: if you need punctuation, go ahead and add it.

Once you've added all your elements, rearrange them using the Arrangement box. Just click the left or right arrows to change an element's position.

Then click 'Do it!'

##How it works

I'm basically using wiktionary's api to fetch word categories. For example, if I want a present participle, I send a get request to [this address](https://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmlimit=500&cmnamespace=0&format=json&cmtitle=Category:English_present_participles).

I then join everything in the order shown in the Arrangement box.

Oh, and AngularJS.

##Credits:
 - Me, [David Newman](https://github.com/Newms34)
 - Wiktionary's API, [Wiktionary.org](https://en.wiktionary.org/w/api.php?action=help)

