import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 1000;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const enname = req.query.enname || '';
    const category = req.query.category || '';
    const encategory = req.query.encategory || '';
    const subcategory = req.query.subcategory || '';
    const brand = req.query.brand || '';
    const vnbrand = req.query.vnbrand || '';
    const description = req.query.description || '';
    const endescription = req.query.endescription || '';
    const model = req.query.model || '';
    const parameter = req.query.parameter || '';
    const enparameter = req.query.enparameter || '';
    const specification = req.query.specification || '';
    const enspecification = req.query.enspecification || '';
    const apply = req.query.apply || '';
    const enapply = req.query.enapply || '';
    const accessories = req.query.accessories || '';
    const enaccessories = req.query.enaccessories || '';
    const video = req.query.video || '';
    const catalog = req.query.catalog || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const ennameFilter = enname ? { enname } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const encategoryFilter = encategory ? {encategory} : {};
    const subcategoryFilter = category ? {category} :{};
    const brandFilter = brand ? { brand } : {};
    const vnbrandFilter = vnbrand ? { vnbrand } : {};
    const modelFilter = model ? { model } : {};
    const parameterFilter = parameter ? { parameter } : {};
    const enparameterFilter = enparameter ? {enparameter} : {};
    const specificationFilter = specification ? {specification} : {};
    const enspecificationFilter = enspecification ? {enspecification} : {};
    const applyFilter = apply ? {apply} : {};
    const enapplyFilter = enapply ? {enapply} : {};
    const accessoriesFilter = accessories ? {accessories} : {};
    const enaccessoriesFilter = enaccessories ? {enaccessories} : {};
    const videoFilter = video ? { video } : {};
    const catalogFilter = catalog ? { catalog } : {};
    const descriptionFilter = description ? {description} : {};
    const endescriptionFilter = endescription ? {endescription} : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...ennameFilter,
      ...categoryFilter,
      ...encategoryFilter,
      ...subcategoryFilter,
      ...brandFilter,
      ...vnbrandFilter,
      ...parameterFilter,
      ...enparameterFilter,
      ...specificationFilter,
      ...enspecificationFilter,
      ...applyFilter,
      ...enapplyFilter,
      ...accessoriesFilter,
      ...enaccessoriesFilter,
      ...descriptionFilter,
      ...endescriptionFilter,
      ...modelFilter,
      ...videoFilter,
      ...catalogFilter,
      ...priceFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...ennameFilter,
      ...categoryFilter,
      ...encategoryFilter,
      ...subcategoryFilter,
      ...brandFilter,
      ...vnbrandFilter,
      ...descriptionFilter,
      ...endescriptionFilter,
      ...modelFilter,
      ...parameterFilter,
      ...enparameterFilter,
      ...specificationFilter,
      ...enspecificationFilter,
      ...applyFilter,
      ...enapplyFilter,
      ...accessoriesFilter,
      ...enaccessoriesFilter,
      ...videoFilter,
      ...catalogFilter,
      ...priceFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/subcategories',
  expressAsyncHandler(async (req, res) => {
    const subcategories = await Product.find().distinct('subcategory');
    res.send(subcategories);
  })
);

productRouter.get(
  '/brands',
  expressAsyncHandler(async (req, res) => {
    const brands = await Product.find().distinct('brand');
    res.send(brands);
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'No seller found. first run /api/users/seed' });
    }
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name ' + Date.now(),
      enname: 'sample name ' ,
      seller: req.user._id,
      image: '/images/3.jpg',
      price: "0",
      category: 'thiet-bi-nganh-giay',
      encategory: 'sample',
      subcategory: '',
      brand: 'ALP - JAPAN',
      vnbrand: 'sample',
      countInStock: 1,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
      endescription: 'sample',
      model: 'sample model',
      parameter: '...',
      enparameter: '...',
      specification: '...',
      enspecification: '...',
      apply: '...',
      enapply: '...',
      accessories: '...',
      enaccessories: '...',
      video: '...',
      catalog: '...',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.enname = req.body.enname;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.encategory = req.body.encategory;
      product.subcategory = req.body.subcategory;
      product.model = req.body.model;
      product.parameter = req.body.parameter;
      product.enparameter = req.body.enparameter;
      product.specification = req.body.specification;
      product.enspecification = req.body.enspecification;
      product.apply = req.body.apply;
      product.enapply = req.body.enapply;
      product.accessories = req.body.accessories;
      product.enaccessories = req.body.enaccessories;
      product.video = req.body.video;
      product.catalog = req.body.catalog;
      product.brand = req.body.brand;
      product.vnbrand = req.body.vnbrand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.endescription = req.body.endescription;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
