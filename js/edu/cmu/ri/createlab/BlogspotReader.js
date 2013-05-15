//======================================================================================================================
// Class for fetching and parsing Blogspot posts.  Success, failure, and read event handlers may be added and will be
// triggered accordingly.  Supports optional truncation of blog content and can also optionally be limited to only
// retrieve the N latest posts.
//
// Dependencies:
// * jQuery (http://jquery.com/)
//
// Author: Chris Bartley (bartley@cmu.edu)
//======================================================================================================================

//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "edu" if it doesn't exist.  Throw an error if it does exist but is not an object.
var edu;
if (!edu)
   {
   edu = {};
   }
else if (typeof edu != "object")
   {
   var eduExistsMessage = "Error: failed to create edu namespace: edu already exists and is not an object";
   alert(eduExistsMessage);
   throw new Error(eduExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu)
   {
   edu.cmu = {};
   }
else if (typeof edu.cmu != "object")
   {
   var eduCmuExistsMessage = "Error: failed to create edu.cmu namespace: edu.cmu already exists and is not an object";
   alert(eduCmuExistsMessage);
   throw new Error(eduCmuExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu.ri)
   {
   edu.cmu.ri = {};
   }
else if (typeof edu.cmu.ri != "object")
   {
   var eduCmuRiExistsMessage = "Error: failed to create edu.cmu.ri namespace: edu.cmu.ri already exists and is not an object";
   alert(eduCmuRiExistsMessage);
   throw new Error(eduCmuRiExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu.ri.createlab)
   {
   edu.cmu.ri.createlab = {};
   }
else if (typeof edu.cmu.ri.createlab != "object")
   {
   var eduCmuRiCreatelabExistsMessage = "Error: failed to create edu.cmu.ri.createlab namespace: edu.cmu.ri.createlab already exists and is not an object";
   alert(eduCmuRiCreatelabExistsMessage);
   throw new Error(eduCmuRiCreatelabExistsMessage);
   }
//======================================================================================================================

//======================================================================================================================
// DEPENDECIES
//======================================================================================================================
if (!window['$'])
   {
   var nojQueryMsg = "The jQuery library is required by edu.cmu.ri.createlab.BlogspotReader.js";
   alert(nojQueryMsg);
   throw new Error(nojQueryMsg);
   }
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function()
   {
   var jQuery = window['$'];

   /**
    * Class for fetching and parsing Blogspot posts.  Success, failure, and read event handlers may be added and will be
    * triggered accordingly.  Supports optional truncation of blog content and can also optionally be limited to only
    * retrieve the N latest posts.
    *
    * The constructor takes two parameters, one required and one optional:
    *    blogName - the name of the blog (e.g. "gigapan-youth-exchange" for the blog http://gigapan-youth-exchange.blogspot.com/)
    *    [dateFormattingFunction] - optional function to convert a javascript Date object into a String.  If not
    *    provided, the date formatter defaults to using Date.toUTCString().
    */
   edu.cmu.ri.createlab.BlogspotReader = function(blogName)
      {
      var blogUrl = 'http://' + blogName + '.blogspot.com/feeds/posts/default?alt=json-in-script';
      var dateFormattingFunction = (arguments[2]) ? arguments[2] : null;
      var numCharactersToTruncateTo = -1;
      var successListeners = new Array();
      var failureListeners = new Array();
      var readEventListeners = new Array();

      /**
       * Specify the Date formatting function.  The function should take a single Date object as an argument and must
       * return a String.
       */
      this.setDateFormattingFunction = function(f)
         {
         if (f)
            {
            dateFormattingFunction = f;
            }
         };

      /**
       * Specify the number of characters at which truncation will be applied.  Defaults to no truncation if this method
       * is not called.  Calling this method with a non-postive value will turn off truncation.
       *
       * See BlogspotReader.truncateTextToNumberOfCharacters() for more information.
       */
      this.setContentTruncation = function(numCharacters)
         {
         numCharactersToTruncateTo = numCharacters;
         };

      /**
       * Registers the given function as a listener for the success event.  All registered listeners will be called upon
       * successful execution of the AJAX call to fetch the blog content.  Each listener function will be called with a
       * single String argument which is the text status of the AJAX call.
       */
      this.addSuccessListener = function(listener)
         {
         if (listener)
            {
            successListeners[successListeners.length] = listener;
            }
         };

      /**
       * Registers the given function as a listener for the failure event.  All registered listeners will be called upon
       * failed execution of the AJAX call to fetch the blog content.  Each listener function will be called with either
       * one or three arguments: textStatus, XMLHttpRequest, and errorThrown.  The XMLHttpRequest and errorThrown
       * arguments will not be provided if the AJAX call completed but the content retrieved was invalid.
       */
      this.addFailureListener = function(listener)
         {
         if (listener)
            {
            failureListeners[failureListeners.length] = listener;
            }
         };

      /**
       * Registers the given function as a listener for the read event.  All registered listeners will be called upon
       * reading each blog post.  Each listener function will be called with the following arguments:
       *
       *    titleText            The post's title
       *    truncatedContent     The post's truncated content if truncation is turned on.  Otherwise, the full content.
       *    content              The posts full content
       *    truncatedSummary     The post's truncated summary if truncation is turned on.  Otherwise, the full summary.
       *    summary              The posts full summary
       *    dateStr              The formatted date
       *    permalinkUrl         The permalink URL
       *    numComments          The number of comments for this post
       *    commentUrl           The URL to the comments
       *    item                 The item object (see Blogspot's API for details about the structure of this object)
       */
      this.addReadEventListener = function(listener)
         {
         if (listener)
            {
            readEventListeners[readEventListeners.length] = listener;
            }
         };

      /**
       * Causes an AJAX call to be made to Blogspot to fetch the blog posts.  Optionally takes a single integer argument
       * specifying the maximum number of posts to retrieve.  Success and failure listeners are notified accordingly.
       * Each read event listener is notified for each post.
       *
       * Either not specifying maxItems or specifying a non-positive value will cause all posts to be retrieved.
       */
      this.read = function(maxItems)
         {
         // set a default value for maxItems if it wasn't provided
         if (arguments.length <= 0)
            {
            maxItems = -1;
            }

         jQuery.ajax
         ({
             type : 'GET',
             dataType : 'jsonp',
             timeout : 5000,
             url : blogUrl,
             success : function(json, textStatus)
                {
                if (json && json['feed'] && json['feed']['entry'])
                   {
                   // notify all the success listeners
                   if (successListeners && successListeners.length > 0)
                      {
                      for (var i = 0; i < successListeners.length; i++)
                         {
                         successListeners[i](textStatus);
                         }
                      }

                   // iterate over all the items and fire an event for each one, optionally limiting the number of items published
                   var items = json['feed']['entry'];
                   var numItemsToRead = Math.min(maxItems, items.length);
                   if (maxItems <= 0)
                      {
                      numItemsToRead = items.length;
                      }
                   for (var j = 0; j < numItemsToRead; j++)
                      {
                      fireReadEvent(items[j]);
                      }
                   }
                else
                   {
                   // notify all the failure listeners
                   if (failureListeners && failureListeners.length > 0)
                      {
                      for (var f = 0; f < failureListeners.length; f++)
                         {
                         failureListeners[f](textStatus);
                         }
                      }
                   }
                },
             error : function(XMLHttpRequest, textStatus, errorThrown)
                {
                // notify all the failure listeners
                if (failureListeners && failureListeners.length > 0)
                   {
                   for (var i = 0; i < failureListeners.length; i++)
                      {
                      failureListeners[i](textStatus, XMLHttpRequest, errorThrown);
                      }
                   }
                }
          });
         };

      var fireReadEvent = function(item)
         {
         if (item)
            {
            var titleText = (item['title'] && item['title']['$t']) ? item['title']['$t'] : "";
            var content = (item['content'] && item['content']['$t']) ? item['content']['$t'] : "";
            var truncatedContent = (numCharactersToTruncateTo > 0) ? edu.cmu.ri.createlab.BlogspotReader.truncateTextToNumberOfCharacters(content, numCharactersToTruncateTo) : content;
            var summary = (item['summary'] && item['summary']['$t']) ? item['summary']['$t'] : "";
            var truncatedSummary = (numCharactersToTruncateTo > 0) ? edu.cmu.ri.createlab.BlogspotReader.truncateTextToNumberOfCharacters(summary, numCharactersToTruncateTo) : summary;
            var urls = item['link'];
            var numComments = (item['thr$total'] && item['thr$total']['$t']) ? item['thr$total']['$t'] : 0;

            // parse the date
            var dateStr = "";
            var rawDateString = (item['published'] && item['published']['$t']) ? item['published']['$t'] : "";
            if (rawDateString != "")
               {
               var datePattern = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})\-0*(\d+):/;
               var matchResult = rawDateString.match(datePattern);
               if (matchResult)
                  {
                  var year = matchResult[1];
                  var month = matchResult[2];
                  var day = matchResult[3];
                  var hour = matchResult[4];
                  var minute = matchResult[5];
                  var second = matchResult[6];
                  var millisecond = matchResult[7];
                  var timezoneOffsetInMillis = matchResult[8] * 60 * 60 * 1000;
                  var date = new Date(timezoneOffsetInMillis + Date.UTC(year, month - 1, day, hour, minute, second, millisecond));

                  // construct a string from the date
                  if (dateFormattingFunction)
                     {
                     dateStr = dateFormattingFunction(date);
                     }
                  else
                     {
                     dateStr = date.toUTCString();
                     }
                  }
               }

            // find the correct URLs
            var permalinkUrl = null;
            var commentUrl = null;
            if (urls)
               {
               for (var j = 0; j < urls.length; j++)
                  {
                  var urlRel = urls[j]['rel'];
                  var urlType = urls[j]['type'];
                  if (urlRel == 'alternate' && urlType == 'text/html')
                     {
                     permalinkUrl = urls[j]['href'];
                     }
                  else if (urlRel == 'replies' && urlType == 'text/html')
                     {
                     commentUrl = urls[j]['href'];
                     }
                  }
               }

            // notify all the read event listeners
            if (readEventListeners && readEventListeners.length > 0)
               {
               for (var k = 0; k < readEventListeners.length; k++)
                  {
                  readEventListeners[k](
                        titleText,
                        truncatedContent,
                        content,
                        truncatedSummary,
                        summary,
                        dateStr,
                        permalinkUrl,
                        numComments,
                        commentUrl,
                        item
                  );
                  }
               }
            }
         };
      };
   edu.cmu.ri.createlab.BlogspotReader.prototype = new Object();
   edu.cmu.ri.createlab.BlogspotReader.prototype.constructor = edu.cmu.ri.createlab.BlogspotReader;

   // =====================================================================================================================
   // PUBLIC STATIC METHODS
   // =====================================================================================================================
   /**
    * Truncates the given text to roughly numCharacters long.  This function looks for a space at or after
    * the numCharacters position and returns everything up to but not including that space.
    */
   edu.cmu.ri.createlab.BlogspotReader.truncateTextToNumberOfCharacters = function(text, numCharacters)
      {
      if (text && numCharacters > 0)
         {
         if (text.length > numCharacters)
            {
            var prefix = text.substring(0, numCharacters);
            // if the character at position numCharacters is a space, we're done
            if (prefix.charAt(numCharacters - 1) == " ")
               {
               return jQuery.trim(prefix);
               }
            else
               {
               // append all the characters up to the first space in the suffix
               var suffix = text.substring(numCharacters);
               var pos = suffix.indexOf(" ");
               if (pos >= 0)
                  {
                  return jQuery.trim(prefix + suffix.substring(0, pos));
                  }
               }
            }
         return text;
         }
      return "";
      };
   })();
