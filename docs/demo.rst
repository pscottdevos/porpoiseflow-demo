===================
Demonstration Notes
===================

The point of these demonstrations are to show that PorpoiseFlow and its REST
interface can handle all of the workflow patterns necessary for HIRE 4.0.

In order not to distract from this purpose, the demonstrations will have the
following properties:

* The client is a text-based client.
* The client interacts with the server *only* via RESTful http calls.
* There are only two types of tasks to be performed:

    - A task that logs user input to the console.
    - A task for choosing between transitions.


Demonstrations
==============

* :ref:`sequence`
* :ref:`parallel-split-synchronization`
* :ref:`exclusive-choice-simple-merge`
* :ref:`multichoice-structured-synchronization`

Setup
=====

1. ``rm db.sqlite3``
2. ``./manage migrate``
3. ``djserve 8000``
