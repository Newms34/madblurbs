String.prototype.initCaps = function() {
    return this[0].toUpperCase() + this.slice(1);
}
var app = angular.module('sentest', []).controller('sen-con', function($scope, $q, $http, $sce) {
    $scope.words = [];
    $scope.currSentNum = -1;
    $scope.currSent = null;
    $scope.currBads = [];
    $scope.currCheck = {};
    $scope.sentences = [{
        text: {},
        lvl: 0,
        order: ['Noun: First (given) Name, Male', 'Verb: 3rd sg. Present']
    }, {
        text: {},
        lvl: 1,
        order: ['Noun: Plural', 'Verb: Present Transitive', 'the', 'Noun: Countable']
    }, {
        text: {},
        lvl: 2,
        order: ['Noun: First (given) Name, Female', 'Verb: 3rd sg. Present', 'Adjective: Present Participle']
    }, {
        text: {},
        lvl: 2,
        order: ['Adjective: Comparative', 'Noun: Plural', 'Verb: Present Intransitive']
    }]
    $scope.wordTypes = [{
        type: 'Noun',
        subtypes: [{
            type: 'Countable',
            ex: 'Dog',
            actualType: 'English_countable_nouns'
        }, {
            type: 'Uncountable',
            ex: 'Sheep',
            actualType: 'English_uncountable_nouns'
        }, {
            type: 'Plural',
            ex: 'Cats',
            actualType: 'English_noun_plural_forms'
        }, {
            type: 'Proper',
            ex: 'England',
            actualType: 'English_proper_nouns'
        }, {
            type: 'First (given) Name, Male',
            ex: 'John',
            actualType: 'English_male_given_names'
        }, {
            type: 'First (given) Name, Female',
            ex: 'Betty',
            actualType: 'English_female_given_names'
        }, {
            type: 'Surname',
            ex: 'Smith',
            actualType: 'English_surnames'
        }]
    }, {
        type: 'Adjective',
        subtypes: [{
            type: 'Positive (Simple)',
            ex: 'Big',
            actualType: 'English_adjectives'
        }, {
            type: 'Comparative',
            ex: 'Louder',
            actualType: 'English_adjective_comparative_forms'
        }, {
            type: 'Superlative',
            ex: 'Smallest',
            actualType: 'English_adjective_superlative_forms'
        }, {
            type: 'Past Participle',
            ex: 'Risen',
            actualType: 'English_past_participles'
        }, {
            type: 'Present Participle',
            ex: 'Eating',
            actualType: 'English_present_participles'
        }]
    }, {
        type: 'Verb',
        subtypes: [{
            type: 'Past Participle',
            ex: 'Risen',
            actualType: 'English_past_participles'
        }, {
            type: 'Present Transitive',
            ex: 'Demonstrate',
            actualType: 'English_transitive_verbs'
        }, {
            type: 'Present Intransitive',
            ex: 'Exist',
            actualType: 'English_intransitive_verbs'
        }, {
            type: '3rd sg. Present',
            ex: 'Thinks',
            actualType: 'English_third-person_singular_forms'
        }, {
            type: 'Simple Past',
            ex: 'Debated',
            actualType: 'English_verb_simple_past_forms'
        }]
    }, {
        type: 'Adverb',
        subtypes: [{
            type: 'Conjunctive',
            ex: 'However',
            actualType: 'English_conjunctive_adverbs'
        }, {
            type: 'Regular',
            ex: 'Quickly',
            actualType: 'English_adverbs'
        }]
    }];
    $scope.getSent = function() {
        $scope.currSentNum++;
        $scope.checked = false;
        $scope.currBads = [];
        $scope.currCheck = {}; //empty check object
        $scope.currSent = $scope.sentences[$scope.currSentNum] ? $scope.sentences[$scope.currSentNum] : null;
        console.log(typeof $scope.currSent)
        $scope.currSent.order.forEach(function(w) {
            $scope.currCheck[w] = $scope.isGrammar(w) ? 1 : 2;
            $scope.currBads.push('no');
        })
    };
    $scope.isGrammar = function(w, m) {
        w = w.split(': ');
        // console.log(w)
        var foundType = false,
            foundSubType = false;
        for (var i = 0; i < $scope.wordTypes.length; i++) {
            if ($scope.wordTypes[i].type == w[0]) {
                foundType = i + 1; //+1 so not falsey!
            }
        }
        if (!foundType) {
            return false;
        } else {
            for (i = 0; i < $scope.wordTypes[foundType - 1].subtypes.length; i++) {
                if ($scope.wordTypes[foundType - 1].subtypes[i].type == w[1]) {
                    foundSubType = i + 1; //again, +1 so not falsey
                }
            }
        }
        return m ? [foundType - 1, foundSubType - 1] : foundSubType;
    }
    $scope.uriBase = 'https://en.wiktionary.org/w/api.php?action=query&prop=categories&format=json&cllimit=500&titles=';
    $scope.checkCat = function(a, c) {
        var theCat = $scope.wordTypes[c[0]].subtypes[c[1]].actualType.replace(/_/g, ' ');
        console.log(a, c, c[0], c[1], 'MEOW!', theCat);
        for (var i = 0; i < a.length; i++) {
            if (a[i].title == 'Category:' + theCat) return true;
        }
        return false;
    }

    $scope.checkSent = function() {
        $scope.currCheck = {};
        var actualWords = {};
        for (var i = 0; i < $scope.currSent.order.length; i++) {
            actualWords[$scope.currSent.order[i]] = !!$scope.currSent.text[$scope.currSent.order[i]];
        }
        console.log('actualWords', actualWords)
        var wordProms = [];
        for (var word in actualWords) {
            //first, if it's a name, we need to capitalize it. This deals with certain English words like "josh", which are both names AND regular words.
            //wiktionary, while it distinguishes between the two, has no way of telling which you mean!
            if (word.indexOf('Name') != -1) {
                $scope.currSent.text[word] = $scope.currSent.text[word].initCaps();
            } else if ($scope.currSent.text[word]) {
                //otherwise, we convert everything to lower case
                $scope.currSent.text[word] = $scope.currSent.text[word].toLowerCase();
            }
            if (actualWords[word]) {
                wordProms.push($.ajax({
                    method: 'GET',
                    url: $scope.uriBase + $scope.currSent.text[word],
                    dataType: 'jsonp'
                }));
            }
        }
        $q.all(wordProms).then(function(c) {
            var currSentWords = Object.keys($scope.currSent.text);
            for (var i = 0, j = 0; i < Object.keys(actualWords).length; i++) {
                if ($scope.currSent.text[Object.keys(actualWords)[i]]) {
                    //this word should be checked.
                    if (c[j].query.pages[-1]) {
                        //word doesnt exist!
                        console.log(c[j].query, 'NOT A WORD')
                        $scope.currCheck[currSentWords[i]] = 0;
                    } else {
                        //word exists! check to make sure it's got the correct category
                        var actualCatArr = $scope.isGrammar(Object.keys($scope.currSent.text)[j], true);
                        if ($scope.checkCat(c[j].query.pages[Object.keys(c[j].query.pages)[0]].categories, actualCatArr)) {
                            $scope.currCheck[currSentWords[j]] = 1;
                            $scope.currBads[i] = 'no';
                        } else {
                            $scope.currCheck[currSentWords[j]] = 0;
                            $scope.currBads[i] = 'yes';
                        }
                    }
                    j++;
                } else {
                    //this word should NOT be checked, as its a 'helper' word
                    $scope.currCheck[Object.keys(actualWords)[i]] = 2;
                }
            }
            console.log('WORD ARR NOW', $scope.currSent.text)
            $scope.checked = true;
        })
    }
});
