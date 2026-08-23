package com.dmart.service;

import com.dmart.dto.request.ProductRequest;
import com.dmart.entity.Category;
import com.dmart.entity.Product;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.CategoryRepository;
import com.dmart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Product> getProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                     String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && search.trim().isEmpty()) {
            search = null;
        }

        return productRepository.filterProducts(categoryId, minPrice, maxPrice, search, pageable);
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getImageUrl(),
                category,
                request.getBrand(),
                request.getMrp(),
                request.getPrice(),
                request.getUnit(),
                request.getStockQuantity(),
                request.getIsPerishable() != null ? request.getIsPerishable() : false,
                request.getShelfLife()
        );

        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null && !request.getCategoryId().equals(product.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setMrp(request.getMrp());
        product.setPrice(request.getPrice());
        product.setUnit(request.getUnit());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getIsPerishable() != null) product.setIsPerishable(request.getIsPerishable());
        if (request.getShelfLife() != null) product.setShelfLife(request.getShelfLife());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());

        return productRepository.save(product);
    }

    @Transactional
    public Product updateStock(Long id, int newStockQuantity) {
        Product product = getProductById(id);
        product.setStockQuantity(Math.max(0, newStockQuantity));
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        // Soft delete by setting inactive
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold);
    }
}
