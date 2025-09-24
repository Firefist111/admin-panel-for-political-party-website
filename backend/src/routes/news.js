
const express = require('express');

const NewsService = require('../services/news');
const NewsDBApi = require('../db/api/news');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

const { parse } = require('json2csv');

/**
 *  @swagger
 *  components:
 *    schemas:
 *      News:
 *        type: object
 *        properties:

 *          headline:
 *            type: string
 *            default: headline
 *          content:
 *            type: string
 *            default: content

 *          
 */

/**
 *  @swagger
 * tags:
 *   name: News
 *   description: The News managing API
 */

/**
*  @swagger
*  /api/news:
*    post:
*      security:
*        - bearerAuth: []
*      tags: [News]
*      summary: Add new item
*      description: Add new item
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              properties:
*                data:
*                  description: Data of the updated item
*                  type: object
*                  $ref: "#/components/schemas/News"
*      responses:
*        200:
*          description: The item was successfully added
*          content:
*            application/json:
*              schema:
*                $ref: "#/components/schemas/News"
*        401:
*          $ref: "#/components/responses/UnauthorizedError"
*        405:
*          description: Invalid input data
*        500:
*          description: Some server error
*/
router.post('/', wrapAsync(async (req, res) => {
    const referer = req.headers.referer || `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await NewsService.create(req.body.data, req.currentUser, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
 * @swagger
 * /api/budgets/bulk-import:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags: [News]
 *    summary: Bulk import items
 *    description: Bulk import items
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          properties:
 *            data:
 *              description: Data of the updated items
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/News"
 *    responses:
 *      200:
 *        description: The items were successfully imported
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/News"
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      405:
 *        description: Invalid input data
 *      500:
 *        description: Some server error
 *
 */
router.post('/bulk-import', wrapAsync(async (req, res) => {
    const referer = req.headers.referer || `${req.protocol}://${req.hostname}${req.originalUrl}`;
    const link = new URL(referer);
    await NewsService.bulkImport(req, res, true, link.host);
    const payload = true;
    res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/news/{id}:
  *    put:
  *      security:
  *        - bearerAuth: []
  *      tags: [News]
  *      summary: Update the data of the selected item
  *      description: Update the data of the selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: Item ID to update
  *          required: true
  *          schema:
  *            type: string
  *      requestBody:
  *        description: Set new item data
  *        required: true
  *        content:
  *          application/json:
  *            schema:
  *              properties:
  *                id:
  *                  description: ID of the updated item
  *                  type: string
  *                data:
  *                  description: Data of the updated item
  *                  type: object
  *                  $ref: "#/components/schemas/News"
  *              required:
  *                - id
  *      responses:
  *        200:
  *          description: The item data was successfully updated
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/News"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.put('/:id', wrapAsync(async (req, res) => {
  await NewsService.update(req.body.data, req.body.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  * @swagger
  *  /api/news/{id}:
  *    delete:
  *      security:
  *        - bearerAuth: []
  *      tags: [News]
  *      summary: Delete the selected item
  *      description: Delete the selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: Item ID to delete
  *          required: true
  *          schema:
  *            type: string
  *      responses:
  *        200:
  *          description: The item was successfully deleted
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/News"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.delete('/:id', wrapAsync(async (req, res) => {
  await NewsService.remove(req.params.id, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

/**
  *  @swagger
  *  /api/news/deleteByIds:
  *    post:
  *      security:
  *        - bearerAuth: []
  *      tags: [News]
  *      summary: Delete the selected item list
  *      description: Delete the selected item list
  *      requestBody:
  *        required: true
  *        content:
  *          application/json:
  *            schema:
  *              properties:
  *                ids:
  *                  description: IDs of the updated items
  *                  type: array
  *      responses:
  *        200:
  *          description: The items was successfully deleted
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/News"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Items not found
  *        500:
  *          description: Some server error
  */
router.post('/deleteByIds', wrapAsync(async (req, res) => {
    await NewsService.deleteByIds(req.body.data, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }));

/**
  *  @swagger
  *  /api/news:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [News]
  *      summary: Get all news
  *      description: Get all news
  *      responses:
  *        200:
  *          description: News list successfully received
  *          content:
  *            application/json:
  *              schema:
  *                type: array
  *                items:
  *                  $ref: "#/components/schemas/News"
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Data not found
  *        500:
  *          description: Some server error
*/
router.get('/', wrapAsync(async (req, res) => {
  const filetype = req.query.filetype
  const currentUser = req.currentUser;
  const payload = await NewsDBApi.findAll(
    req.query, { currentUser }
  );
  if (filetype && filetype === 'csv') {
    const fields = ['id','headline','content',

      'published_date',
        ];
    const opts = { fields };
    try {
      const csv = parse(payload.rows, opts);
      res.status(200).attachment(csv);
      res.send(csv)

    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(200).send(payload);
  }

}));

/**
 *  @swagger
 *  /api/news/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [News]
 *      summary: Count all news
 *      description: Count all news
 *      responses:
 *        200:
 *          description: News count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/News"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/count', wrapAsync(async (req, res) => {
    const currentUser = req.currentUser;
    const payload = await NewsDBApi.findAll(
        req.query,
         null,
        { countOnly: true, currentUser }
    );

    res.status(200).send(payload);
}));

/**
 *  @swagger
 *  /api/news/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [News]
 *      summary: Find all news that match search criteria
 *      description: Find all news that match search criteria
 *      responses:
 *        200:
 *          description: News list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/News"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/autocomplete', async (req, res) => {
  const payload = await NewsDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
    req.query.offset,
  );

  res.status(200).send(payload);
});

/**
  * @swagger
  *  /api/news/{id}:
  *    get:
  *      security:
  *        - bearerAuth: []
  *      tags: [News]
  *      summary: Get selected item
  *      description: Get selected item
  *      parameters:
  *        - in: path
  *          name: id
  *          description: ID of item to get
  *          required: true
  *          schema:
  *            type: string
  *      responses:
  *        200:
  *          description: Selected item successfully received
  *          content:
  *            application/json:
  *              schema:
  *                $ref: "#/components/schemas/News"
  *        400:
  *          description: Invalid ID supplied
  *        401:
  *          $ref: "#/components/responses/UnauthorizedError"
  *        404:
  *          description: Item not found
  *        500:
  *          description: Some server error
  */
router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await NewsDBApi.findBy(
    { id: req.params.id },
  );

  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
